# Core Web Vitals AI Analyzer — Backend

AI-powered performance analysis API built with FastAPI, Google PageSpeed Insights, and OpenAI.

---

## Quick Start

### 1. Create & activate virtual environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
Edit `.env` in the `backend/` directory:
```env
OPENAI_API_KEY=your_openai_key
GOOGLE_PAGESPEED_API_KEY=your_pagespeed_key
FRONTEND_URL=http://localhost:5173
```

### 4. Run the server
```bash
# From the backend/ directory
uvicorn app.main:app --reload --port 8000
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Liveness check |
| GET | `/docs` | Swagger UI |
| POST | `/api/v1/analyze` | Analyze a URL |

### POST `/api/v1/analyze`

**Request:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "report": {
    "lcp": "2.5 s",
    "cls": "0.012",
    "fcp": "1.2 s",
    "speed_index": "2.8 s",
    "tbt": "120 ms",
    "performance_score": 78,
    "performance_grade": "Good"
  },
  "ai_suggestions": {
    "performance_issues": ["..."],
    "seo_impact": ["..."],
    "optimization_suggestions": ["..."],
    "react_optimization_tips": ["..."],
    "caching_recommendations": ["..."],
    "image_optimization": ["..."]
  }
}
```

---

## Performance Grades

| Score | Grade |
|-------|-------|
| 90–100 | Excellent |
| 70–89 | Good |
| 50–69 | Needs Improvement |
| 0–49 | Poor |

---

## Folder Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, routing
│   ├── config/
│   │   └── settings.py      # Env vars via pydantic-settings
│   ├── models/
│   │   └── request_models.py # Pydantic request/response schemas
│   ├── routes/
│   │   └── analyze.py       # POST /analyze endpoint
│   ├── services/
│   │   ├── pagespeed_service.py  # Google PageSpeed API
│   │   └── ai_service.py         # OpenAI GPT analysis
│   └── utils/
│       └── helpers.py       # Formatting & logging utilities
├── .env
├── requirements.txt
└── README.md
```

---

## Future Roadmap

- [ ] JWT authentication
- [ ] PostgreSQL + SQLAlchemy for saved reports
- [ ] User dashboard with history
- [ ] Multi-page batch analysis
- [ ] AI memory across sessions
- [ ] Autonomous optimization agent
