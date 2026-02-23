# SkyCast Monorepo Weather App

This is a monorepo containing a Spring Boot backend and a React (Vite) frontend.

## Prerequisites
- Java 21+
- Node.js 18+
- OpenWeatherMap API Key (already set in `.env`)

## Project Structure
- `/backend`: Spring Boot application (Port 8080)
- `/frontend`: React application (Port 5173 - Proxies `/api` to 8080)

## How to Run

### 1. Start the Backend
Navigate to the `backend` directory and run:
```bash
# Set environment variable (Windows/PowerShell)
$env:OPEN_WEATHER_API_KEY="<KEY>"
mvn spring-boot:run
```

### 2. Start the Frontend
Navigate to the `frontend` directory and run:
```bash
npm install
npm run dev
```

## API Endpoints
- `GET http://localhost:8080/`: Health Check
- `GET http://localhost:8080/api/get-weather?location={city}`: Get weather for a city
