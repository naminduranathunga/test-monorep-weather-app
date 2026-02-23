import { useState } from 'react'
import './App.css'

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    main: string;
    icon: string;
  }>;
}

function App() {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!location) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/get-weather?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error('Location not found or API error');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="weather-card">
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>Weather App</h1>

        <form onSubmit={fetchWeather} className="search-container">
          <input
            type="text"
            placeholder="Enter city name..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {loading && <div className="loading">Fetching current weather...</div>}

        {error && <div className="error">{error}</div>}

        {weather && !loading && (
          <div className="weather-info">
            <h2 className="city-name">{weather.name}</h2>
            <p className="weather-desc">{weather.weather[0]?.description}</p>

            <div className="temp-container">
              <span className="temperature">{Math.round(weather.main.temp)}°C</span>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <p className="detail-label">Humidity</p>
                <p className="detail-value">{weather.main.humidity}%</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Pressure</p>
                <p className="detail-value">{weather.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
            Enter a location to see weather details
          </div>
        )}
      </div>
    </div>
  )
}

export default App
