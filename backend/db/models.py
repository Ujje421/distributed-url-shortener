from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    urls = relationship("URL", back_populates="user")
    domains = relationship("Domain", back_populates="user")

class Domain(Base):
    __tablename__ = "domains"
    
    id = Column(Integer, primary_key=True, index=True)
    domain_name = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="domains")
    urls = relationship("URL", back_populates="domain")

class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    long_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=True)

    user = relationship("User", back_populates="urls")
    domain = relationship("Domain", back_populates="urls")
    analytics = relationship("Analytics", back_populates="url", cascade="all, delete-orphan")

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    url_id = Column(Integer, ForeignKey("urls.id"), nullable=False)
    click_time = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String)
    user_agent = Column(String)
    device_type = Column(String)
    country = Column(String)

    url = relationship("URL", back_populates="analytics")
