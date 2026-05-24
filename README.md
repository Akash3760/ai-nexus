# AI Nexus

A modern, scalable, enterprise-grade AI platform built with Django and React.

AI Nexus follows a clean, modular, production-ready architecture inspired by large-scale SaaS systems and modern engineering practices.

---

## Overview

AI Nexus is designed to support:

- AI-powered chat systems
- Intelligent automation workflows
- Workspace collaboration
- Authentication & Authorization
- Background task processing
- Real-time communication
- API-first architecture
- Modular scalability

The platform separates backend and frontend concerns for maintainability and long-term growth.

---

## Project Structure

```txt
ai-nexus/
│
├── nexus-api/                  # Django Backend
├── nexus-web/                  # React Frontend
│
├── docs/                       # Documentation
├── .gitignore
├── README.md
└── LICENSE
```

---

## Tech Stack

### Backend

- Python 3.12+
- Django 5.2 LTS
- Django REST Framework
- MySQL
- Redis
- Celery
- Django Unfold Admin
- python-dotenv
- Black
- isort
- pyclean

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- React Router
- Axios
- Zustand
- Framer Motion
- Lucide Icons

---

# Backend Architecture (`nexus-api`)

The backend follows a scalable domain-based architecture.

```txt
nexus-api/
│
├── apps/
│   ├── common/                # Shared utilities
│   ├── accounts/              # User management
│   ├── authentication/        # Authentication system
│   ├── ai_engine/             # AI logic & services
│   ├── chat/                  # Chat system
│   ├── workspace/             # Workspace features
│   └── notifications/         # Notifications
│
├── api/
│   └── v1/                    # API versioning
│
├── config/                    # Django configuration
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── core/                      # Core infrastructure
│   ├── celery.py
│   ├── constants.py
│   ├── permissions.py
│   └── exceptions.py
│
├── logs/
│   ├── django.log
│   ├── error.log
│   └── celery.log
│
├── media/
├── static/
│
├── .env
├── .env.example
├── requirements.txt
├── pyproject.toml
└── manage.py
```

---

# Frontend Architecture (`nexus-web`)

The frontend uses a scalable feature-based structure.

```txt
nexus-web/
│
├── public/
│
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   └── endpoints.js
│   │
│   ├── app/
│   │   ├── router.jsx
│   │   └── providers.jsx
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/                # shadcn components
│   │
│   ├── config/
│   │   └── env.js
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── chat/
│   │   └── ai/
│   │
│   ├── hooks/
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx
│   │   ├── DashboardLayout.jsx
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   └── index.jsx
│   │
│   ├── services/
│   ├── store/
│   │   ├── authStore.js
│   │   └── appStore.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   │
│   ├── utils/
│   ├── lib/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── components.json
├── jsconfig.json
├── package.json
└── vite.config.js
```

---

## Backend Setup

### 1. Navigate to backend

```bash
cd nexus-api
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Create superuser

```bash
python manage.py createsuperuser
```

### 7. Run development server

```bash
python manage.py runserver
```

Backend URL:

```txt
http://127.0.0.1:8000
```

---

## Frontend Setup

### 1. Navigate to frontend

```bash
cd nexus-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

## Environment Variables

### Backend (`nexus-api/.env`)

```env
DEBUG=True

SECRET_KEY=your-secret-key

ALLOWED_HOSTS=127.0.0.1,localhost

CORS_ALLOWED_ORIGINS=http://localhost:5173

DB_NAME=ai_nexus
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

REDIS_URL=redis://127.0.0.1:6379/1

CELERY_BROKER_URL=redis://127.0.0.1:6379/0
CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/0
```

### Frontend (`nexus-web/.env`)

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## Code Quality

Format code:

```bash
black .
isort .
```

Clean cache:

```bash
pyclean .
```

---

## Logging

Logs are stored inside:

```txt
logs/
├── django.log
├── error.log
└── celery.log
```

---

## Development Standards

AI Nexus follows:

- Clean Architecture
- Modular Design
- Scalable API Structure
- Environment-based Configuration
- Production-grade Logging
- Background Task Processing
- Code Formatting Standards

---

## Future Roadmap

- JWT Authentication
- RBAC (Role-Based Access Control)
- AI Chat Engine
- Workspace Management
- WebSocket Real-time Features
- File Processing Pipelines
- Docker Deployment
- CI/CD Pipeline
- Monitoring & Observability

---

## License

Private Project — AI Nexus