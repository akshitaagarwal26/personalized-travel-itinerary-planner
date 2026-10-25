
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client

# Load environment variables from backend/.env
ENV_FILE = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_FILE, override=True)

# Initialize FastAPI
app = FastAPI(title="Travel Itinerary Planner API", version="0.1.0")

# Allow the React frontend to access the backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://personalized-trav-git-edcc65-akshita-arwals-projects-c1bfbf62.vercel.app",
        "https://personalized-travel-itinerary-planner-115k2r4bx.vercel.app",
        "https://personalized-travel-itinerary-plann-lime.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = None

if SUPABASE_URL and SUPABASE_SECRET_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
    except Exception as exc:
        print("Supabase initialization failed:", type(exc).__name__)
else:
    print("Supabase configuration is missing. Check backend/.env")

print("Supabase client initialized:", supabase is not None)


# Request model
class TripRequest(BaseModel):
    destination: str = Field(min_length=1, max_length=150)
    days: int = Field(default=3, ge=1, le=30)
    budget: str = "Moderate"
    interests: str = "Nature"


# Generate a simple itinerary based on interests
def build_itinerary(trip: TripRequest):
    activities = {
        "Nature": [
            "Explore a scenic park or garden",
            "Visit a nearby natural viewpoint",
            "Enjoy a relaxing outdoor walk",
        ],
        "Adventure": [
            "Try a local adventure activity",
            "Explore an outdoor destination",
            "Enjoy an adventure experience",
        ],
        "Food": [
            "Explore local food markets",
            "Try popular regional dishes",
            "Visit a local cafe",
        ],
        "History": [
            "Visit a historical landmark",
            "Explore a local museum",
            "Discover the city's cultural heritage",
        ],
        "Shopping": [
            "Explore a local shopping market",
            "Browse traditional handicraft stores",
            "Visit a shopping district",
        ],
    }

    selected = activities.get(trip.interests, activities["Nature"])
    itinerary = []

    for day in range(1, trip.days + 1):
        first = (day - 1) % len(selected)
        day_activities = [
            selected[first],
            selected[(first + 1) % len(selected)],
            selected[(first + 2) % len(selected)],
        ]

        itinerary.append(
            {
                "day": day,
                "title": f"Day {day} in {trip.destination}",
                "activities": day_activities,
            }
        )

    return itinerary


# Home endpoint
@app.get("/")
def home():
    return {"message": "Travel Planner API is running!"}


# Generate itinerary endpoint
@app.post("/generate-itinerary")
def generate_itinerary(trip: TripRequest):
    return {
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "interests": trip.interests,
        "itinerary": build_itinerary(trip),
    }


# Save trip to Supabase
@app.post("/save-trip")
def save_trip(trip: TripRequest):
    if supabase is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase is not configured. Check backend/.env.",
        )

    trip_data = {
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "interests": trip.interests,
        "itinerary": build_itinerary(trip),
    }

    try:
        result = supabase.table("trips").insert(trip_data).execute()

        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="The trip was not returned after saving.",
            )

        return {
            "message": "Trip saved successfully!",
            "trip": result.data[0],
        }

    except HTTPException:
        raise
    except Exception as exc:
        # Log the exception type without exposing credentials
        print("Supabase save failed:", type(exc).__name__)
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to save the trip. Check the backend terminal "
                "and your Supabase table configuration."
            ),
        )
