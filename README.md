# ASCENTech Workspace By Harshali Nerkar

A premium, full-stack Project Management System designed with a modern **Dark Mode** aesthetic, **Glassmorphism** UI, and **Kanban** task management.

---

## 🚀 Features

- **Authentication**: Secure Login & Register with JWT and Cookies.
- **Premium UI**: 
  - 🌙 **Dark Mode**: Sleek, developer-focused workspace.
  - 🎨 **Glassmorphism**: Translucent navbars and cards.
  - ✨ **Animations**: Smooth transitions and hover effects.
- **Project Management**: 
  - Create and Delete Projects.
  - View "Quick Stats" on the Dashboard.
- **Kanban Board**:
  - Drag-and-drop style Task Management.
  - Organize tasks into **To Do**, **In Progress**, and **Done**.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, TypeScript.
- **Backend**: Django REST Framework, SQLite.

## 📦 Setup Instructions

### 1. Backend Setup (Django)
```bash
cd "backend(R)"
python -m venv venv
# Activate venv:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
The backend runs on `http://127.0.0.1:8000`.

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `(http://localhost:3000/login)`.

---
**Created by Harshali Nerkar**
