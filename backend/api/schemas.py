from pydantic import BaseModel, HttpUrl
from datetime import datetime

class URLCreate(BaseModel):
    long_url: HttpUrl
    expires_in_hours: int | None = None
    custom_domain: str | None = None

class URLResponse(BaseModel):
    short_url: str
    expires_at: datetime | None = None

class ClicksByDate(BaseModel):
    date: str
    clicks: int

class TopCountry(BaseModel):
    country: str
    clicks: int

class TopDevice(BaseModel):
    device: str
    clicks: int

class AnalyticsResponse(BaseModel):
    total_clicks: int
    clicks_over_time: list[ClicksByDate]
    top_countries: list[TopCountry]
    top_devices: list[TopDevice]
