# Ticket Reservation System

A complete REST API application built with Flask (Python) backend and React TypeScript frontend, for PPM course backend project.

Front-end app link: https://toscana-events.netlify.app
Back-end app link: https://toscana-events.onrender.com

I used NeonDB for the database.

## 🎯 Project Overview

This application implements a ticket reservation system with:
- **2 different apps**: Events and Reservations
- **2 model relationships**: User→Reservations, Event→Reservations  
- **1 Class-generics view**: BaseResourceView with TypeVar
- **2 permission levels**: Anonymous (view only) and Registered (full access)
- **Extended User model**: Custom user class with role-based permissions
- **JWT Authentication**: Secure token-based authentication

## 🏗️ Architecture

### Backend (Flask)
- **Modular structure** with separate apps for Events and Reservations
- **SOLID principles** with dependency injection and separation of concerns
- **Generic base classes** for DRY code reuse
- **JWT authentication** with role-based permissions
- **SQLAlchemy ORM** with PostgreSQL database
- **Marshmallow** for request/response serialization

### Frontend (React TypeScript)
- **Component-based architecture** with clear separation of concerns
- **Custom hooks** for API integration and state management
- **Context API** for global authentication state
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for responsive styling

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL
- Git

### Backend Setup
```bash
cd backend
  python -m venv .venv
  source .venv/bin/activate  # On Windows: .venv\Scripts\activate
  pip install -r requirements.txt

  # Setup environment
  cp .env.example .env
  # Edit .env with your database credentials

  # Initialize database
  python app.py
```



### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### 🔐 Authentication & Permissions

#### Anonymous Users

✅ View events (GET /api/events)
✅ Search and filter events
❌ Cannot create reservations

#### Registered Users

✅ All anonymous permissions
✅ Create reservations (POST /api/reservations)
✅ Process payments (POST /api/reservations/{id}/payment)
✅ Cancel reservations (POST /api/reservations/{id}/cancel)
✅ View reservation history (GET /api/reservations)

## 📚 API Documentation

#### Authentication Endpoints

POST /api/auth/register    # User registration
POST /api/auth/login       # User login  
GET  /api/auth/me          # Get current user

#### Events Endpoints

GET    /api/events         # List events (public)
GET    /api/events/{id}    # Get event details (public)
POST   /api/events         # Create event (admin only)
PUT    /api/events/{id}    # Update event (admin only)
DELETE /api/events/{id}    # Delete event (admin only)

#### Reservations Endpoints

GET  /api/reservations              # User's reservations
GET  /api/reservations/{id}         # Get reservation details
POST /api/reservations              # Create reservation
POST /api/reservations/{id}/payment # Process payment
POST /api/reservations/{id}/cancel  # Cancel reservation
PUT  /api/reservations/{id}         # Update reservation

### 🧪 Demo Accounts
The application includes sample data for testing:

#### Registered User:
Email: user@example.com
Password: user123


#### Admin User:
Email: admin@example.com
Password: admin123
