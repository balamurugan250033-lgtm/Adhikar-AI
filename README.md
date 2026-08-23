# Adhikar AI

> Make public services easier to understand, access, and follow up.

Adhikar AI is a citizen-support application for preparing clear Right to Information (RTI) applications and discovering relevant public-service guidance. It combines a React interface with a FastAPI backend and supports multilingual workflows for citizens in India.

## Live Links

- **Repository:** [github.com/balamurugan250033-lgtm/Adhikar-AI](https://github.com/balamurugan250033-lgtm/Adhikar-AI)
- **Frontend (local):** [http://localhost:3000](http://localhost:3000)
- **Backend health check (local):** [http://localhost:8000](http://localhost:8000)
- **Interactive API docs (local):** [http://localhost:8000/docs](http://localhost:8000/docs)

## What It Does

- Generates structured RTI application drafts from a citizen's issue.
- Routes common problems toward a likely ministry or public authority.
- Provides submission guidance and next steps after drafting.
- Supports English and India's scheduled-language workflows.
- Offers voice input where the browser supports Speech Recognition.
- Stores draft history locally in the browser for convenient follow-up.
- Includes public-service rights and government-scheme tools.

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Tailwind CSS, Create React App |
| Backend | FastAPI, Uvicorn, Python |
| Client requests | Fetch API and Axios |
| Local persistence | Browser `localStorage` |

## Run Locally

### Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer
- npm

### 1. Start the backend

From the repository root:

```powershell
cd backend
python -m pip install fastapi uvicorn
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` and its Swagger documentation at `http://localhost:8000/docs`.

### 2. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Windows shortcut

From the repository root, run `frontend\start.bat` to launch both services in separate terminal windows. The shortcut assumes Python dependencies are already installed and that `uvicorn` is available on `PATH`.

## API Surface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Backend health check |
| `POST` | `/generate-rti` | Generate an RTI draft |
| `POST` | `/api/rti/draft` | Generate an RTI draft for the RTI tool |
| `POST` | `/api/rights/navigate` | Get rights and navigation guidance |

Use the interactive documentation at `/docs` for request schemas and testing.

## Project Structure

```text
Adhikar-AI/
├── backend/
│   └── app/
│       └── main.py          # FastAPI application and API routes
├── frontend/
│   ├── src/
│   │   ├── components/      # Dashboard and citizen tools
│   │   └── App.js           # Application shell and navigation
│   └── start.bat            # Windows launcher
└── README.md
```

## Development

Build the frontend for production with:

```powershell
cd frontend
npm run build
```

Run the frontend test suite with:

```powershell
npm test
```

## Security and Privacy

- Never commit `.env` files, API keys, service-account credentials, or personal citizen data.
- Keep secrets in environment variables or a local secret manager.
- Draft history is stored in the user's browser and is not a server-side case-management system.
- Review generated content before submitting it to an official portal.
- Adhikar AI provides informational assistance and does not replace legal advice or official government guidance.

## License

License information will be added when the project license is formalized.