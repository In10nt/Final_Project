# Virtual Try-On Platform - Start Guide

## Quick Start

```bash
docker-compose up --build
```

## Access

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **API Docs:** http://localhost:8080/swagger-ui.html

## MySQL Configuration

- **Host:** localhost:3306
- **Database:** virtual_tryon
- **Username:** root
- **Password:** password

## Project Structure

```
├── admin_dashboard/     # React Frontend
├── backend/             # Spring Boot Backend (Java)
├── docker-compose.yml   # Docker orchestration
├── DATABASE_SCHEMA.sql  # MySQL schema
└── README.md           # Documentation
```

## Services

| Service | Port | Status |
|---------|------|--------|
| Frontend (React) | 3000 | http://localhost:3000 |
| Backend (Spring Boot) | 8080 | http://localhost:8080 |
| MySQL Database | 3306 | localhost:3306 |
| Redis Cache | 6379 | localhost:6379 |

## Stop Services

```bash
docker-compose down
```

## Reset Database

```bash
docker-compose down -v
docker-compose up --build
```
