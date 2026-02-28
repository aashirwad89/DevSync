🚀 DevSync

DevSync is a full-stack, developer-focused platform that simulates real-world Git workflows while integrating issue tracking, authentication, and an AI assistant — all within a modern, CLI-inspired interface.

Built with a product mindset, DevSync focuses on structured backend state transitions, repository isolation, and scalable system design.

🔥 Core Features
🧠 Git Workflow Simulation Engine

DevSync implements a structured command-processing system that mimics real Git operations:

init – Initialize repository workspace

add – Stage changes

commit – Create version snapshots

push – Sync local state to remote

pull – Fetch remote updates

revert – Roll back to previous commit state

Each command triggers controlled backend state transitions with persistent commit history storage per repository.

🗂 Multi-Repository Architecture

Multi-user support

Repository-level data isolation

Independent commit history per repository

Metadata tracking (owner, timestamps, activity logs)

Designed with scalability and clean data separation in mind.

🐞 Issue Tracking System

Each repository includes:

Issue creation & management

Status-based tracking

Ownership assignment

Persistent storage

Models real-world collaborative debugging workflows.

🔐 Secure Authentication

User registration & login

Token-based authentication (JWT)

Protected frontend routes

Backend middleware guards

Structured to support future role-based access control.

🤖 Integrated AI Assistant

An embedded AI assistant designed to:

Assist with debugging

Suggest improvements

Support architectural reasoning

Enhance developer productivity

Built as a contextual support layer inside the platform.

🏗 Tech Stack
Frontend

React (Vite)

JavaScript

Modern animated UI

CLI-inspired developer theme

Backend

Node.js

Express.js

MongoDB Atlas

Deployment

Frontend: Vercel

Backend: Render

📦 Project Structure
DevSync/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── main.jsx
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone <repo-url>
cd DevSync
2️⃣ Backend Setup
cd backend
npm install
npm start

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🚀 Deployment

Backend deployed on Render

Frontend deployed on Vercel

MongoDB Atlas as cloud database

Auto-deployment via Git integration

🎯 Design Philosophy

DevSync is built around:

Structured backend logic

Clean separation of concerns

Product-driven architecture

Scalable repository isolation

Developer-first user experience

This project reflects production-oriented thinking rather than UI mimicry.

📌 Future Enhancements

Real-time collaboration via WebSockets

Advanced permission systems

Activity analytics dashboard

Branch simulation layer

Performance optimization at scale

👨‍💻 Author

Built with a product-engineering mindset focused on scalable system design, backend architecture, and real-world workflow modeling.

- Aashirwad Singh
