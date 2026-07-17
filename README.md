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
- **Instant Shortening**: Generate clean, short aliases for long URLs.
- **Lightning Fast Redirects**: Uses Redis to cache URL lookups, ensuring O(1) read latency.
- **Background GeoIP Tracking**: Uses `httpx` in a non-blocking FastAPI Background Task to look up user location without delaying the redirect.
- **Advanced DB Aggregation**: Analytics endpoint uses SQLAlchemy `func.date_trunc`, `func.count`, and `group_by` to build real-time click distribution, top countries, and top devices metrics directly from PostgreSQL.
- **Unified Modern UI**: Built with Tailwind v4, utilizing a clean layout with dynamic Recharts integration.

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
