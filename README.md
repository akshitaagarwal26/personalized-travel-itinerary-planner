# TravelMate – Personalized Travel Itinerary Planner

TravelMate is a web application that helps users create personalized day-by-day travel itineraries based on their destination, trip duration, budget, and interests.

## Features

- Enter a travel destination and trip duration.
- Select a budget and travel interest.
- Generate a day-by-day itinerary.
- Save trip details and itinerary data to Supabase.
- Responsive React user interface.
- FastAPI backend for itinerary generation and trip storage.

## Technology Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Python, FastAPI
- **Database:** Supabase
- **API documentation:** Swagger UI

## Project Structure

```text
personalized-travel-itinerary-planner/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── index.html
└── .gitignore
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/akshitaagarwal26/personalized-travel-itinerary-planner.git
cd personalized-travel-itinerary-planner
```

### 2. Set up the backend

Create and activate a Python virtual environment inside the `backend` directory, then install dependencies:

```bash
cd backend
python -m venv venv
```

On Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `backend/.env` file with your own Supabase project credentials:

```text
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_server_side_secret_key
```

Never commit your real `.env` file or secret keys.

Start the backend:

```bash
python -m uvicorn main:app --reload --port 8000
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check API status |
| POST | `/generate-itinerary` | Generate an itinerary |
| POST | `/save-trip` | Save trip details to Supabase |

Interactive API documentation is available at `http://127.0.0.1:8000/docs` while the backend is running.

## Current Implementation

The current itinerary generator uses predefined activities selected according to travel interests. Generative AI integration and live deployment can be added as future enhancements.

## Author

Akshita Agarwal

## License

No license has been added yet.
