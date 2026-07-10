<div align="center">

# 🛡️ TrustGuard 
### *AI-Powered Real-Time Financial Trust & Fraud Prevention Platform*

<p align="center">

A production-ready fintech platform that leverages Artificial Intelligence, behavioral analytics, graph intelligence, and secure payment processing to detect fraudulent activities, monitor financial risk, and strengthen digital trust in modern banking systems.

</p>

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)]()
[![Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)]()
[![Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)]()
[![Database](https://img.shields.io/badge/Database-Neon-00E599?style=for-the-badge)]()
[![Payments](https://img.shields.io/badge/Payments-Razorpay-0C73FE?style=for-the-badge)]()

# 🌐 Live Demo

| 🚀 Frontend | https://fintech-fraud-system-one.vercel.app |

# 📖 Overview

TrustGuard AI is a production-grade financial fraud detection and digital trust platform designed to simulate modern banking security systems.

The platform combines **Artificial Intelligence**, **behavioral analytics**, **network graph visualization**, **role-based access control**, and **secure payment processing** to identify suspicious financial activities while providing administrators with powerful investigation tools.

Unlike conventional banking dashboards, TrustGuard AI focuses on explaining **why** transactions become risky, helping analysts investigate fraud patterns through interactive graph analysis and trust scoring.

---
# ✨ Key Features

## 🔐 Authentication & Authorization

- Secure JWT Authentication
- Password Encryption using BCrypt
- Protected REST APIs
- Persistent User Sessions
- Role-Based Access Control (RBAC)
- Secure Logout

---
## 👥 Role-Based Access Control

- Customer , Analyst , Admin

  ---

# 💳 Banking Module

- Secure Banking Dashboard
- Auto-generated Account Numbers
- Balance Management
- Deposit Funds
- Razorpay Payment Integration
- Recent Recipients
- Money Transfer
- Transaction History
- Trust Score Display

---

# 🧠 AI Fraud Detection

- Trust Score Engine
- Behavioral Analysis
- Suspicious Transaction Detection
- Risk Score Calculation
- Device Intelligence
- Login Monitoring
- Transaction Pattern Analysis
- Fraud Alert Generation

---

# 🌐 Interactive Fraud Network Graph

Visual investigation dashboard providing

- Relationship Graph
- Interactive Account Nodes
- Transaction Links
- Risk Visualization
- Investigation Timeline
- AI Investigation Summary
- Pattern Detection
- Transaction Flow Explorer

---

# 📊 Analytics Dashboard

Interactive analytical insights including

- Risk Distribution
- Transaction Trends
- High Risk Users

---

# 💰 Secure Fund Deposit

The latest banking module introduces secure online deposits using **Razorpay**.

### Features

- Add Funds Securely
- Instant Balance Update
- Transaction Recording
- Protected Payment APIs

---

# 🏗 Production Architecture

```text
                 ┌────────────────────────────┐
                 │        React Frontend      │
                 │    TypeScript + Vite       │
                 └─────────────┬──────────────┘
                               │
                     REST API (JWT)
                               │
                 ┌─────────────▼──────────────┐
                 │     Express.js Backend     │
                 │ Business Logic & Security  │
                 └─────────────┬──────────────┘
                               │
                 PostgreSQL Queries
                               │
                 ┌─────────────▼──────────────┐
                 │     Neon PostgreSQL        │
                 └─────────────┬──────────────┘
                               │
         ┌─────────────────────┼────────────────────┐
         │                     │                    │
    Razorpay API         AI Services         External APIs
```

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS,Framer Motion
- Axios
---

## Backend

- Node.js
- Express.js
- JWT Authentication
- BCrypt
- REST APIs

---

## Database

- PostgreSQL
- Neon Database

---

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon |

---

## External APIs

- Razorpay Payment API

---
# ⚙️ Local Installation

## Prerequisites

Ensure the following software is installed.

- Node.js >= 18
- npm
- PostgreSQL
- Git

---

## Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY>

cd TrustGuard-AI
```

---

## Install Frontend

```bash
cd frontend

npm install
```

Run development server

```bash
npm run dev
```

Frontend will start at

```text
http://localhost:5173
```

---

## Install Backend

```bash
cd backend

npm install
```

Run server

```bash
npm run dev
```

Backend will start at

```text
http://localhost:5000
```

---
# 🔐 Authentication Workflow

```text
User Login

      │

      ▼

Email + Password

      │

      ▼

BCrypt Verification

      │

      ▼

JWT Generation

      │

      ▼

Protected APIs

      │

      ▼

Role Validation

      │

      ▼

Dashboard
```

---
# 🧪 Testing

TrustGuard AI has been tested across multiple functional modules to ensure reliability, security, and consistent user experience.

# 🔒 Security Features

TrustGuard AI follows multiple security practices inspired by modern financial systems.

### Authentication

- JWT Authentication
- BCrypt Password Hashing
- Protected API Routes
- Session Validation

---
### Authorization

- Role-Based Access Control
- Middleware-Level Authorization
- Route Protection
- Secure Dashboard Access

---

### Banking Security

- Secure Payment Verification
- Server-side Razorpay Validation
- Protected Banking APIs
- Account Ownership Validation

---

### Data Protection

- Parameterized SQL Queries
- Password Encryption
- Environment Variables
- Secure API Communication

---
# 📌 Future Roadmap

The following features are planned for future releases.

### AI Features

- AI-powered Fraud Explanation
- LLM Assisted Investigation
- Fraud Prediction Engine
---

### Banking

- QR Code Payments
- Scheduled Transfers
- Beneficiary Management
- Account Statements (PDF)
---

### Security

- Two Factor Authentication (2FA)
- OTP Verification
- Email Notifications
- SMS Alerts
- Biometric Login

---

### Administration

- User Activity Logs
- System Audit Logs
- Admin Notifications
- Case Management System

---

### Platform

- Mobile Application
- Docker Deployment
- Kubernetes Support
- CI/CD Pipeline
- Microservice Architecture

---
# 📚 Learning Outcomes

This project helped strengthen practical knowledge in:

- Full Stack Development
- REST API Design
- PostgreSQL Database Design
- Authentication & Authorization
- Banking System Architecture
- AI-based Fraud Detection
- Graph Visualization
- Payment Gateway Integration
- Production Deployment
- Software Architecture
- Secure Coding Practices

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve TrustGuard AI:

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Add New Feature"
```

4. Push your branch

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

# 🐞 Reporting Issues

If you discover a bug or have a feature request, please open an issue describing:

- Problem Description
- Expected Behaviour
- Steps to Reproduce
- Screenshots (if applicable)

---
# 👨‍💻 Developer

## Debasish Pradhan

Computer Science & Engineering Student

Passionate about

- Artificial Intelligence
- Full Stack Development
- Cyber Security
- Financial Technology
- Problem Solving

---

## 📬 Contact

**GitHub**

> https://github.com/Debasishpradhan28

**LinkedIn**

> https://www.linkedin.com/in/debasish-pradhan-185508312

**Portfolio - Github**

> https://github.com/Debasishpradhan28/fintech-fraud-system

**Email**

> debasishpradhan236@gmail.com

---

<div align="center">

# ⭐ If you found this project useful

Please consider giving it a **Star ⭐** on GitHub.

It motivates future development and helps others discover the project.

---

### 🛡️ TrustGuard

**Building Intelligent Financial Security with Artificial Intelligence**

Made with ❤️ by **Debasish Pradhan**

</div>


