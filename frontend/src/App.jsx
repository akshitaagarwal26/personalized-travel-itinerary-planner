
import { useState } from "react";
import "./App.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://personalized-travel-itinerary-planner-79m9.onrender.com";


function App() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("Moderate");
  const [interests, setInterests] = useState("Nature");

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const generateItinerary = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");
    setTrip(null);

    try {
      const response = await fetch(`${API_URL}/generate-itinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: destination.trim(),
          days: Number(days),
          budget,
          interests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? typeof data.detail === "string"
              ? data.detail
              : "Please check your trip details."
            : "Failed to generate itinerary."
        );
      }

      setTrip(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure FastAPI is running on port 8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async () => {
    if (!trip) {
      setError("Please generate an itinerary before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/save-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: trip.destination,
          days: trip.days,
          budget: trip.budget,
          interests: trip.interests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to save your trip."
        );
      }

      setMessage("Your trip has been saved successfully!");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Please check that it is running."
          : err.message
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            ✈️
          </span>
          <span>TravelMate</span>
        </div>

        <p className="header-tagline">
          Your journey, personalized.
        </p>
      </header>

      <main className="main-content">
        <section className="hero">
          <p className="eyebrow">YOUR PERSONAL TRAVEL PLANNER</p>

          <h1>
            Your next adventure,
            <br />
            <span>planned perfectly.</span>
          </h1>

          <p className="hero-description">
            Tell us where you want to go, your budget, and what you love.
            We'll create a day-by-day itinerary for your trip.
          </p>
        </section>

        <section className="planner-card">
          <div className="section-heading">
            <h2>Plan your trip</h2>
            <p>Customize your next adventure.</p>
          </div>

          <form onSubmit={generateItinerary}>
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                type="text"
                placeholder="e.g. Manali, Goa, Jaipur"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="days">Duration (days)</label>
                <input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(event) => setDays(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget</label>
                <select
                  id="budget"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                >
                  <option value="Budget">Budget-friendly</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="interests">Travel interests</label>
              <select
                id="interests"
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
              >
                <option value="Nature">Nature & relaxation</option>
                <option value="Adventure">Adventure</option>
                <option value="Food">Food & local cuisine</option>
                <option value="History">History & culture</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading || saving}
            >
              {loading ? "Creating your itinerary..." : "Generate My Itinerary"}
            </button>
          </form>
        </section>

        {error && (
          <div className="notice error-notice" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="notice success-notice" role="status">
            {message}
          </div>
        )}

        {trip && (
          <section className="results-section">
            <div className="results-heading">
              <p className="eyebrow">YOUR PERSONALIZED PLAN</p>
              <h2>{trip.destination} awaits!</h2>
              <p>
                {trip.days} days · {trip.budget} budget · {trip.interests}
              </p>
            </div>

            <div className="itinerary-list">
              {trip.itinerary.map((day) => (
                <article className="day-card" key={day.day}>
                  <div className="day-number">
                    <span>DAY</span>
                    <strong>{day.day}</strong>
                  </div>

                  <div className="day-details">
                    <h3>{day.title}</h3>

                    <ul>
                      {day.activities.map((activity, index) => (
                        <li key={`${day.day}-${index}`}>
                          <span className="activity-dot" aria-hidden="true">
                            •
                          </span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <button
              className="primary-button save-button"
              type="button"
              onClick={saveTrip}
              disabled={saving || loading}
            >
              {saving ? "Saving your trip..." : "Save Trip"}
            </button>

            <p className="save-caption">
              Save your itinerary to your TravelMate database.
            </p>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Made for explorers, with TravelMate ✈️</p>
      </footer>
    </div>
  );
}

export default App;
