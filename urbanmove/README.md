# UrbanMove 🚀 - Smart Mobility Platform

UrbanMove is a production-ready cloud-native backend and frontend prototype for a smart mobility platform. It handles user authentication, trip management, real-time vehicle simulation, and analytics.

## 🏗 Architecture Overview

The system follows a modular **Service-Based Architecture** (similar to MVC):

- **Routes**: Handle HTTP endpoints and delegate to controllers.
- **Controllers**: Manage request/response lifecycle.
- **Services**: Contain the core business logic (Auth, Mobility, Analytics).
- **Models**: Act as an abstraction layer for data persistence.
- **Background Worker**: Processes event queues (simulating Big Data pipelines).
- **Vehicle Simulator**: Generates real-time mobility data every 3 seconds.

## ☁️ Cloud Mapping

This project is designed to mirror real-world cloud architectures:

- **AWS EC2 (Compute)**: The backend and frontend can be deployed on EC2 instances.
- **Docker (Containerization)**: Both components are container-ready for consistent deployment.
- **JSON Storage (Persistence)**: Currently using `data.json`. In a real production system, this would be swapped for **Amazon RDS (PostgreSQL)** or **MongoDB Atlas**.
- **Event Queue (Messaging)**: The internal array-based queue represents **Amazon SQS** or **Apache Kafka** for decoupled processing.
- **Winston (Observability)**: Standard logging practice, which would be integrated with **AWS CloudWatch** in production.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, JWT, Winston, UUID.
- **Frontend**: React (Vite), Axios.
- **DevOps**: Docker, Docker Compose.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional)

### Local Development

1. **Backend**:
   ```bash
   npm install
   node index.js
   ```
   The server will run on `http://localhost:3000`.

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Run

To run the entire system in containers:
```bash
docker-compose up --build
```

## 📈 API Endpoints

- `GET /`: Health check and status.
- `POST /auth/register`: Create a new user.
- `POST /auth/login`: Get JWT token.
- `POST /mobility/trip`: Create a new trip (Auth required).
- `GET /analytics`: Get platform stats (Auth required).

## 📝 Logging

- `logs/app.log`: General application activity.
- `logs/error.log`: Error stack traces and issues.

---
*Created for University Cloud Computing Project - 2026*
