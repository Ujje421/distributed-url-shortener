from fastapi import Request, HTTPException
from core.redis_client import redis_client

class RateLimiter:
    def __init__(self, times: int = 5, window_seconds: int = 60):
        """
        Fixed window rate limiter using Redis.
        :param times: Max number of requests allowed
        :param window_seconds: The time window in seconds
        """
        self.times = times
        self.window_seconds = window_seconds

    async def __call__(self, request: Request):
        # We can use the client IP or a forwarded header if behind a proxy
        client_ip = request.client.host if request.client else "unknown_ip"
        # Create a unique key for this IP and the endpoint path
        key = f"rate_limit:{client_ip}:{request.url.path}"

        # Increment the counter for this key
        current = redis_client.incr(key)
        
        # If this is the first request, set the expiration window
        if current == 1:
            redis_client.expire(key, self.window_seconds)
            
        if current > self.times:
            raise HTTPException(
                status_code=429, 
                detail="Too Many Requests. Please slow down and try again later."
            )
        return True
