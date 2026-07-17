# SwiftZip - Distributed URL Shortener 🚀

A highly scalable, distributed URL shortener service designed to handle high throughput, complete with a modern React frontend and a real-time PostgreSQL analytics dashboard.

## 📸 Screenshots

### Home Page - Shorten URLs instantly
![SwiftZip Dashboard](docs/doc1%20(2).png)

### Real-Time Analytics Dashboard
![SwiftZip Home Page](docs/doc1%20(1).png)

## 🏗 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Recharts (for analytics graphs)
- **Backend**: FastAPI (High-performance Python web framework)
- **Caching**: Redis (Sub-millisecond latency for fast redirects)
- **Database**: PostgreSQL (Persistent storage & complex analytics aggregations)
- **Infrastructure**: Docker & Docker Compose
- **External Services**: IP-API for GeoIP tracking (handled via FastAPI Background Tasks)

## ⚡ Key Features
- **Enterprise-Grade UI**: A total frontend overhaul delivering a high-end SaaS aesthetic (crisp layout, Vercel-like design) built with React and Tailwind CSS v4.
- **Cache Penetration Protection (Bloom Filter)**: Implemented a custom probabilistic data structure using Redis Bitsets to intercept and instantly reject queries for non-existent URLs at O(1) time complexity without hitting the database.
- **Redis Rate Limiting**: A fixed-window rate limiter built on Redis to prevent API abuse and throttle excessive requests, returning HTTP `429 Too Many Requests`.
- **Custom Link Expiry**: Users can now set custom TTLs (1 Hour, 1 Day, 7 Days) for short links. The expiration logic is synchronized natively via Redis `SETEX` and persisted via an `expires_at` database column.
- **Lightning Fast Redirects**: Uses Redis to cache valid URL lookups, ensuring sub-millisecond read latency.
- **Background GeoIP Tracking**: Uses `httpx` in a non-blocking FastAPI Background Task to capture user location without delaying the redirect.
- **Advanced DB Aggregation**: Analytics endpoint leverages PostgreSQL and SQLAlchemy `func.date_trunc`, `func.count`, and `group_by` to power a live metrics dashboard tracking click distribution, top countries, and devices.

## 🚀 How to Run Locally

1. **Start the backend and databases (Docker):**
   ```bash
   docker-compose up -d
   ```
2. **Run backend migrations & server:**
   ```bash
   cd backend
   alembic upgrade head
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
3. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---
*A portfolio project by Ujjwal Jagtap showcasing Distributed Systems, FastAPI, React, and Redis Caching.*
