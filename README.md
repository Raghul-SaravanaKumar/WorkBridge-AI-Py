# Work Bridge AI

Intelligent Contractor & Skilled Worker Hiring Platform.

## Technology Stack

- **Frontend**: React.js, Vite, React Router, Lucide React
- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic, PyJWT, Passlib
- **Database**: MongoDB

## Features
- Role-based Registration and Login (Customer / Worker)
- Job Posting and Management
- Worker Profile Management
- Smart Match Engine with NLP-based Skill Normalization

## Requirements

1. **Python 3.11** or higher.
2. **Node.js** (v16+) and npm.
3. **MongoDB Community Server** running on `localhost:27017` (default).

## Local Setup Instructions

### 1. Database
Make sure your local MongoDB instance is running.

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
python -m venv venv
```
Activate the virtual environment:
- **Windows**: `.\venv\Scripts\activate`
- **macOS/Linux**: `source venv/bin/activate`

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file (you can copy `.env.example`):
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=workbridge
JWT_SECRET=supersecretjwtkey
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Start the backend:
```bash
uvicorn app.main:app --reload
```
The FastAPI backend will start at `http://localhost:8000`. You can view the API documentation at `http://localhost:8000/docs`.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

## Usage
1. Open `http://localhost:5173` in your browser.
2. Register as a Customer or Worker.
3. If Worker, complete your profile details.
4. If Customer, post a job and view Smart Match recommendations.
