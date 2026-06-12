# 🎓 CareerSphere - AI Career Guidance System

CareerSphere is an AI-powered career guidance web application designed to help students discover suitable career paths based on their interests, stream selection, skills, and aptitude. The platform provides career recommendations, degree suggestions, career reports, and personalized guidance through an interactive dashboard.

---

## 🚀 Features

### 👤 User Management
- User Registration
- User Login Authentication
- Secure Password Hashing using Bcrypt
- User Profile Management

### 🧠 AI Career Recommendation
- Interest-based Career Suggestions
- Stream-wise Career Recommendations
- AI Career Matching Algorithm
- Career Guidance Chatbot

### 📚 Career Exploration
- Stream Selector Module
- Degree Finder Module
- Career Roadmaps
- Required Skills Suggestions

### 📊 Student Reports
- Personalized Career Reports
- Quiz Results Tracking
- Career Exploration History
- Bookmarked Degrees
- Progress Statistics Dashboard

### 📩 Contact System
- Contact Form
- Message Storage in Database

---

## 🏗️ Project Architecture

```text
CareerSphere
│
├── Frontend (HTML, CSS, JavaScript)
│
├── Backend (FastAPI)
│
├── Database (SQLite)
│
└── AI Recommendation Engine
```

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- FastAPI
- Uvicorn

### Database
- SQLite
- SQLAlchemy ORM

### Authentication
- Passlib (Bcrypt)

### API Testing
- Swagger UI

---

## 📂 Project Structure

```text
career-guidance-system/

│
├── backend/
│   ├── main.py
│   ├── routes.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   ├── database.py
│   ├── career_data.py
│   ├── career_logic.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── modules.html
│   ├── reports.html
│   ├── profile.html
│   ├── css/
│   └── js/
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone

cd careersphere
```

---

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

Activate Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux/Mac

```bash
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Run Backend

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 5️⃣ Run Frontend

Open:

```text
frontend/index.html
```

Or use VS Code Live Server Extension.

---

## 🗄️ Database Setup

Create tables automatically:

```python
from database import engine
from models import Base

Base.metadata.create_all(bind=engine)
```

Run once before starting the application.

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint |
|----------|------------|
| POST | /register |
| POST | /login |

---

### Career Recommendation

| Method | Endpoint |
|----------|------------|
| POST | /recommend-career |
| POST | /career-quiz |
| POST | /career-chat |
| POST | /ai-career-recommendation |

---

### Education Guidance

| Method | Endpoint |
|----------|------------|
| POST | /select-stream |
| POST | /degree-finder |

---

### Reports

| Method | Endpoint |
|----------|------------|
| GET | /reports |
| POST | /reports/save |
| GET | /reports/bookmarks |
| POST | /reports/bookmark |

---

### Contact

| Method | Endpoint |
|----------|------------|
| POST | /contact |

---

## 📊 Use Case Flow

### Student Journey

```text
Register/Login
        ↓
Select Stream
        ↓
Take Career Quiz
        ↓
AI Recommendation
        ↓
Degree Suggestions
        ↓
Bookmark Degrees
        ↓
Generate Report
        ↓
View Dashboard
```

---

## 🔒 Security Features

- Password Hashing (Bcrypt)
- Authentication Middleware
- Protected Report Endpoints
- SQL Injection Protection via SQLAlchemy ORM

---

## 🎯 Future Enhancements

- JWT Authentication
- Resume Analyzer
- AI Interview Preparation
- Career Prediction using Machine Learning
- College Recommendation System
- Admin Dashboard
- Email Notifications
- PDF Report Generation

---

## 📸 Screenshots

uploaded in screenshots folder.. 

## 👨‍💻 Developed By

Shweta Gupta
Disha shah

AI-Powered Career Guidance Platform for Students

---


---

## ⭐ Support

If you found this project useful, please give it a ⭐ on GitHub.
