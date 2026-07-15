# AI CRM HCP

## Overview

AI CRM HCP is a Healthcare Professional (HCP) Interaction Management System built using React, FastAPI, MySQL, LangGraph, and Groq LLM.

The application enables medical representatives to log doctor interactions manually or generate structured interaction details automatically using AI.

---

## Tech Stack

### Frontend
- React
- Axios
- CSS

### Backend
- FastAPI
- SQLAlchemy
- Python

### AI
- LangGraph
- LangChain
- Groq (gemma2-9b-it)

### Database
- MySQL

---

## Features

- AI Meeting Assistant
- Log Interaction
- Edit Interaction
- Delete Interaction
- Search Doctor
- Interaction Dashboard
- MySQL Database
- FastAPI REST APIs
- LangGraph Workflow
- Groq AI Integration

---

## APIs

### POST /interaction
Create a new interaction.

### GET /interactions
Fetch all interactions.

### PUT /interaction/{id}
Update interaction.

### DELETE /interaction/{id}
Delete interaction.

### POST /ai/chat
Generate interaction details using AI.

---

## Project Structure

backend/

- app/
- ai.py
- crud.py
- database.py
- models.py
- schemas.py
- main.py

frontend/

- src/
- App.jsx
- services/
- components/
- pages/
- styles/

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## AI Workflow

User enters meeting notes

↓

Groq LLM

↓

LangGraph Agent

↓

Extracts

- Doctor Name
- Interaction Type
- Discussion
- Outcome
- Follow Up

↓

Auto fills CRM Form

↓

Stores into MySQL

---

## Future Improvements

- Authentication
- Dashboard Analytics
- File Upload
- Voice Notes
- Export PDF

---

## Author

Sudeep D R
