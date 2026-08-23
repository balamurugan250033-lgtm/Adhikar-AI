# Vigrah AI

Make public services easier to understand, access, and follow up.

Vigrah AI is a citizen-support application for preparing clear Right to Information (RTI) applications and discovering relevant public-service guidance. It combines a React interface with a FastAPI backend and supports multilingual workflows for citizens in India.

> **Disclaimer:** Vigrah AI is an independent informational tool. It is not a Government of India website, does not submit applications on a citizen's behalf, and does not replace official instructions or legal advice. Always verify details on the relevant government portal before submitting.

---

## 🔗 Live Links

* **Repository:** [github.com/balamurugan250033-lgtm/Vigrah-AI](https://github.com/balamurugan250033-lgtm/Vigrah-AI)
* **Production website:** [vigrah.vercel.app](https://vigrah.vercel.app/)
* **Frontend (local):** `http://localhost:3000`
* **Backend health check (local):** `http://localhost:8000`
* **Interactive API docs (local):** `http://localhost:8000/docs`

---

## 📸 Screenshots

<p align="center">
  <b>Home Dashboard (Light & Dark Mode)</b><br>
  <img src="Screenshot 2026-08-23 221906.png" alt="Vigrah AI Landing Page Light Mode" width="48%" />
  <img src="Screenshot 2026-08-23 221700.png" alt="Vigrah AI Landing Page Dark Mode" width="48%" />
</p>

<p align="center">
  <b>Generated RTI Draft & PDF Export</b><br>
  <img src="Screenshot 2026-08-23 221736.png" alt="Vigrah AI Drafted RTI Application" width="96%" />
</p>

---

## ✨ What It Does

* **Automated RTI Drafting:** Generates structured RTI application drafts from a citizen's issue.
* **Smart Routing:** Routes common problems toward a likely ministry or public authority.
* **Submission Guidance:** Provides submission guidance and next steps after drafting.
* **Multilingual Workflows:** Supports English and India's scheduled-language workflows.
* **Voice Input:** Offers voice input where the browser supports Speech Recognition.
* **Local Persistence:** Stores draft history locally in the browser for convenient follow-up.
* **Rights & Guidance Tools:** Includes public-service rights and government-scheme tools.

---

## 🛠️ Technology

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS, Create React App |
| **Backend** | FastAPI, Uvicorn, Python |
| **Client requests** | Fetch API and Axios |
| **Local persistence** | Browser localStorage |

---

## 🚀 Run Locally

### Prerequisites

* Python 3.10 or newer
* Node.js 18 or newer
* npm

### 1. Start the backend

From the repository root:
```bash
cd backend
python -m pip install fastapi uvicorn
python -m uvicorn app.main:app --reload --port 8000
