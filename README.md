# Intelligent Bridge

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://frontend-pi-ten-86.vercel.app)

🔗 **Live Demo:** [https://frontend-pi-ten-86.vercel.app](https://frontend-pi-ten-86.vercel.app)

Intelligent Bridge is an AI-powered return inspection and routing dashboard.

It includes:
- A FastAPI backend for image grading and return history APIs
- A Streamlit frontend for uploading real images and viewing AI decisions
- A local SQLite database for processed return records

## 1. Prerequisites

Install the following before setup:
- Python 3.10 or newer
- Git (optional, for version control)
- Internet access for installing Python packages and calling Gemini

## 2. Project Structure

- [backend/main.py](backend/main.py): FastAPI app and API routes
- [backend/gemini_service.py](backend/gemini_service.py): Gemini integration and grading schema
- [backend/database.py](backend/database.py): SQLite persistence
- [frontend/app.py](frontend/app.py): Streamlit dashboard
- [requirements.txt](requirements.txt): Required Python packages
- [.env](.env): Environment variables (you create this file)

## 3. Create and Activate Virtual Environment

From the project root folder:

Windows PowerShell:

    python -m venv .venv
    .\.venv\Scripts\Activate.ps1

If PowerShell blocks activation, run once as needed:

    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Then activate again:

    .\.venv\Scripts\Activate.ps1

## 4. Install All Required Packages

Install from [requirements.txt](requirements.txt):

    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt

## 5. Required Packages (What Gets Installed)

The project installs these direct dependencies:
- fastapi==0.136.3
- uvicorn==0.49.0
- python-dotenv==1.2.2
- google-genai==2.8.0
- pydantic==2.13.4
- python-multipart==0.0.32
- streamlit==1.58.0
- requests==2.34.2

## 6. Configure Environment Variables

Create a file named .env in the project root.

Add your Gemini API key:

    GEMINI_API_KEY=your_actual_api_key_here

Important:
- Do not commit .env to public repositories
- The backend reads this in [backend/gemini_service.py](backend/gemini_service.py)

## 7. Run the Backend API

Open terminal 1, move to backend folder, then run:

    cd backend
    python main.py

Expected output includes:
- Uvicorn running on http://127.0.0.1:8000

## 8. Run the Frontend Dashboard

Open terminal 2 from project root and run:

    python -m streamlit run frontend/app.py --server.port 8501

Open in browser:
- http://localhost:8501

## 9. Verify the Setup

Checklist:
1. Backend terminal shows startup logs without errors
2. Frontend opens successfully
3. Sidebar indicates backend is connected
4. You can upload a real image and get a grading result
5. History updates after each successful processing request

Optional API check from PowerShell:

    Invoke-RestMethod http://127.0.0.1:8000/api/history | ConvertTo-Json -Depth 5

## 10. Common Installation and Runtime Issues

Issue: Module not found
- Cause: Packages not installed in active environment
- Fix:

    python -m pip install -r requirements.txt

Issue: GEMINI_API_KEY is not set
- Cause: Missing or invalid .env file
- Fix: Ensure .env exists in project root and includes a valid key

Issue: Frontend cannot connect to backend
- Cause: Backend not running or wrong port
- Fix:
1. Start backend first
2. Confirm backend URL is http://127.0.0.1:8000

Issue: Port already in use
- Fix: Stop old process or run with another port

Backend alternative:

    uvicorn main:app --host 127.0.0.1 --port 8001 --reload

Frontend alternative:

    python -m streamlit run frontend/app.py --server.port 8502

## 11. Reinstall from Scratch

If you want a clean reinstall:

1. Delete .venv folder
2. Recreate virtual environment
3. Reinstall dependencies

Commands:

    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt

## 12. Production Notes

This setup is for local development and demos.

Before production deployment, consider:
- Proper secrets management instead of plain .env
- Restrictive CORS policy in [backend/main.py](backend/main.py)
- Persistent cloud database instead of local SQLite
- HTTPS and authentication controls
