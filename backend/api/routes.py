from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date, desc
from pydantic import HttpUrl
from db.database import get_db, SessionLocal
from db.models import URL, Analytics
from api.schemas import URLCreate, URLResponse, AnalyticsResponse
from services.base62 import encode_id, decode_id
from services.analytics import parse_user_agent
from core.redis_client import redis_client
from core.config import settings
import httpx

router = APIRouter()

def save_analytics(url_id: int, ip_address: str, user_agent: str, device_type: str):
    db = SessionLocal()
    try:
        country = "Unknown"
        if ip_address and ip_address not in ["127.0.0.1", "::1", "localhost", "0.0.0.0", "Unknown"]:
            try:
                with httpx.Client() as client:
                    res = client.get(f"http://ip-api.com/json/{ip_address}", timeout=2.0)
                    data = res.json()
                    if data.get("status") == "success":
                        country = data.get("country", "Unknown")
            except Exception:
                pass
        elif ip_address in ["127.0.0.1", "::1", "localhost"]:
            country = "Localhost"
        
        new_click = Analytics(
            url_id=url_id,
            ip_address=ip_address,
            user_agent=user_agent,
            device_type=device_type,
            country=country
        )
        db.add(new_click)
        db.commit()
    except Exception as e:
        print(f"Error saving analytics: {e}")
    finally:
        db.close()


@router.post("/api/shorten", response_model=URLResponse)
def shorten_url(url_data: URLCreate, db: Session = Depends(get_db)):
    new_url = URL(long_url=str(url_data.long_url))
    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    short_code = encode_id(new_url.id)
    redis_client.set(short_code, str(url_data.long_url))

    return URLResponse(short_url=f"{settings.BASE_URL}/{short_code}")


@router.get("/{short_code}")
def redirect_to_url(short_code: str, request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    long_url = redis_client.get(short_code)

    if not long_url:
        try:
            url_id = decode_id(short_code)
        except ValueError:
            raise HTTPException(status_code=404, detail="Invalid short code")
        
        url_record = db.query(URL).filter(URL.id == url_id).first()
        if not url_record:
            raise HTTPException(status_code=404, detail="URL not found")
        
        long_url = url_record.long_url
        redis_client.set(short_code, long_url)
    else:
        try:
            url_id = decode_id(short_code)
        except ValueError:
            raise HTTPException(status_code=404, detail="Invalid short code")

    ip_address = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "")
    device_type = parse_user_agent(user_agent)

    # Dispatch to background task to avoid blocking the redirect
    background_tasks.add_task(save_analytics, url_id, ip_address, user_agent, device_type)

    return RedirectResponse(url=long_url, status_code=302)


@router.get("/api/analytics/{short_code}", response_model=AnalyticsResponse)
def get_analytics(short_code: str, db: Session = Depends(get_db)):
    try:
        url_id = decode_id(short_code)
    except ValueError:
        raise HTTPException(status_code=404, detail="Invalid short code")
    
    url_record = db.query(URL).filter(URL.id == url_id).first()
    if not url_record:
        raise HTTPException(status_code=404, detail="URL not found")

    total_clicks = db.query(Analytics).filter(Analytics.url_id == url_id).count()

    # Clicks over time (grouped by date)
    clicks_by_day = db.query(
        cast(Analytics.click_time, Date).label('date'),
        func.count(Analytics.id).label('clicks')
    ).filter(Analytics.url_id == url_id).group_by(cast(Analytics.click_time, Date)).order_by(cast(Analytics.click_time, Date)).all()

    clicks_over_time = [{"date": str(c.date), "clicks": c.clicks} for c in clicks_by_day]

    # Top Countries
    top_countries_db = db.query(
        Analytics.country,
        func.count(Analytics.id).label('clicks')
    ).filter(Analytics.url_id == url_id).group_by(Analytics.country).order_by(desc('clicks')).limit(5).all()

    top_countries = [{"country": c.country, "clicks": c.clicks} for c in top_countries_db]

    # Top Devices
    top_devices_db = db.query(
        Analytics.device_type,
        func.count(Analytics.id).label('clicks')
    ).filter(Analytics.url_id == url_id).group_by(Analytics.device_type).order_by(desc('clicks')).limit(5).all()

    top_devices = [{"device": c.device_type, "clicks": c.clicks} for c in top_devices_db]

    return AnalyticsResponse(
        total_clicks=total_clicks,
        clicks_over_time=clicks_over_time,
        top_countries=top_countries,
        top_devices=top_devices
    )
