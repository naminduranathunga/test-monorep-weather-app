import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import {
  FiSearch,
  FiMapPin,
  FiWind,
  FiCloud,
  FiAlertTriangle
} from 'react-icons/fi';
import {
  WiHumidity,
  WiBarometer,
  WiThermometer,
  WiRain,
  WiSnow,
  WiRaindrops,
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiThunderstorm,
  WiFog
} from 'react-icons/wi';
import './App.css';

// Lottie animation imports
import Foggy from '../lottiefiles/Foggy.json';
import CloudyNight from '../lottiefiles/Weather-cloudy(night).json';
import Mist from '../lottiefiles/Weather-mist.json';
import Night from '../lottiefiles/Weather-night.json';
import PartlyCloudy from '../lottiefiles/Weather-partly cloudy.json';
import PartlyShower from '../lottiefiles/Weather-partly shower.json';
import RainyNight from '../lottiefiles/Weather-rainy(night).json';
import StormShowersDay from '../lottiefiles/Weather-storm&showers(day).json';
import Storm from '../lottiefiles/Weather-storm.json';
import Sunny from '../lottiefiles/Weather-sunny.json';
import Windy from '../lottiefiles/Weather-windy.json';

const SUGGESTION_CITIES = ['Colombo', 'Kandy', 'London', 'New York', 'Tokyo', 'Paris'];

interface WeatherData {
  name: string;
  coord: {
    lon: number;
    lat: number;
  };
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like?: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    threeHour?: number;
    '3h'?: number;
  };
  snow?: {
    threeHour?: number;
    '3h'?: number;
  };
  pop: number;
}

interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
  };
}

function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [selectedForecast, setSelectedForecast] = useState<ForecastItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [randomAnimation, setRandomAnimation] = useState<any>(null);

  // Pick a random animation on initial mount
  useEffect(() => {
    const animations = [
      Foggy, CloudyNight, Mist, Night, PartlyCloudy,
      PartlyShower, RainyNight, StormShowersDay, Storm, Sunny, Windy
    ];
    const index = Math.floor(Math.random() * animations.length);
    setRandomAnimation(animations[index]);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    fetchWeatherForCity(location.trim());
  };

  const handleSuggestionClick = (city: string) => {
    setLocation(city);
    fetchWeatherForCity(city);
  };

  const fetchWeatherForCity = async (cityName: string) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast(null);
    setSelectedForecast(null);

    try {
      // 1. Fetch current weather data
      const response = await fetch(`/api/get-weather?location=${encodeURIComponent(cityName)}`);
      if (!response.ok) {
        throw new Error(`City "${cityName}" not found.`);
      }
      const weatherData: WeatherData = await response.json();
      setWeather(weatherData);

      // 2. Extract coordinates and fetch timeline
      const { lat, lon } = weatherData.coord;
      const forecastResponse = await fetch(`/api/get-hourly-timeline?lat=${lat}&lon=${lon}`);
      if (!forecastResponse.ok) {
        throw new Error('Failed to retrieve forecast details.');
      }
      const forecastData: ForecastData = await forecastResponse.json();
      setForecast(forecastData);

      // Default the bottom details panel to the first forecast item
      if (forecastData.list && forecastData.list.length > 0) {
        setSelectedForecast(forecastData.list[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  // Maps active weather to a Lottie animation
  const getLottieAnimation = (weatherMain: string, description: string, iconCode: string) => {
    const isNight = iconCode.endsWith('n');
    const main = weatherMain.toLowerCase();
    const desc = description.toLowerCase();

    if (isNight) {
      if (main === 'clear') return Night;
      if (main === 'rain' || main === 'drizzle') return RainyNight;
      if (main === 'clouds') return CloudyNight;
    }

    if (main === 'clear') return Sunny;

    if (main === 'clouds') {
      if (desc.includes('few') || desc.includes('scattered') || desc.includes('broken')) {
        return PartlyCloudy;
      }
      return Foggy;
    }

    if (main === 'rain' || main === 'drizzle') {
      if (desc.includes('heavy') || desc.includes('thunderstorm') || desc.includes('extreme')) {
        return Storm;
      }
      return PartlyShower;
    }

    if (main === 'thunderstorm') {
      return isNight ? Storm : StormShowersDay;
    }

    if (['mist', 'smoke', 'haze', 'sand', 'dust', 'fog', 'ash', 'squall'].includes(main)) {
      return Mist;
    }

    if (main === 'tornado') return Windy;
    if (main === 'snow') return Foggy;

    if (desc.includes('wind') || desc.includes('breeze')) {
      return Windy;
    }

    return Sunny;
  };

  // Maps timeline weather items to Wi Icons
  const getWeatherIcon = (weatherMain: string, iconCode: string) => {
    const isNight = iconCode.endsWith('n');
    const main = weatherMain.toLowerCase();

    if (main === 'clear') {
      return isNight ? <WiNightClear /> : <WiDaySunny />;
    }
    if (main === 'clouds') {
      return <WiCloudy />;
    }
    if (main === 'rain' || main === 'drizzle') {
      return <WiRain />;
    }
    if (main === 'thunderstorm') {
      return <WiThunderstorm />;
    }
    if (main === 'snow') {
      return <WiSnow />;
    }
    if (['mist', 'smoke', 'haze', 'sand', 'dust', 'fog', 'ash', 'squall', 'tornado'].includes(main)) {
      return <WiFog />;
    }
    return <WiDaySunny />;
  };

  const formatTimelineTime = (dt: number) => {
    const date = new Date(dt * 1000);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours} ${ampm}`;
  };

  const formatTimelineDate = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDetailsTime = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const rainAmount = selectedForecast?.rain?.['3h'] ?? selectedForecast?.rain?.threeHour ?? 0;
  const snowAmount = selectedForecast?.snow?.['3h'] ?? selectedForecast?.snow?.threeHour ?? 0;

  return (
    <div className="app-container">
      <div className="weather-card">
        {/* Title */}
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.03em' }}>
          SkyCast Weather
        </h1>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="search-wrapper">
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="suggestions-container">
          {SUGGESTION_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(city)}
              disabled={loading}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="error">
            <FiAlertTriangle style={{ fontSize: '1.25rem' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="dashboard-grid">
            {/* Left Column Skeleton */}
            <div className="current-weather-panel">
              <div className="lottie-container">
                <div className="skeleton skeleton-lottie"></div>
              </div>
              <div className="weather-info">
                <div className="skeleton skeleton-title" style={{ width: '80%', margin: '0 auto 0.75rem auto' }}></div>
                <div className="skeleton skeleton-desc" style={{ width: '50%', margin: '0 auto 1.5rem auto' }}></div>
                <div className="skeleton skeleton-temp" style={{ margin: '0 auto 1rem auto' }}></div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="forecast-panel">
              {/* Timeline skeleton */}
              <div className="timeline-section" style={{ marginTop: 0 }}>
                <div className="skeleton" style={{ width: '160px', height: '1.3rem', marginBottom: '1rem', borderRadius: '4px' }}></div>
                <div className="skeleton-timeline-row">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton skeleton-timeline-card"></div>
                  ))}
                </div>
              </div>

              {/* Details skeleton */}
              <div className="selected-details-container" style={{ marginTop: 0 }}>
                <div className="details-header">
                  <div className="skeleton" style={{ width: '120px', height: '1.1rem', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ width: '90px', height: '0.9rem', borderRadius: '4px' }}></div>
                </div>
                <div className="skeleton-metric-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton skeleton-metric-card"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Weather Loaded State */}
        {weather && forecast && !loading && (
          <div className="dashboard-grid">
            {/* Left Column: Current weather card */}
            <div className="current-weather-panel">
              {/* Lottie Animation Display */}
              <div className="lottie-container">
                <Lottie
                  animationData={getLottieAnimation(
                    weather.weather[0]?.main,
                    weather.weather[0]?.description,
                    weather.weather[0]?.icon
                  )}
                  loop={true}
                />
              </div>

              {/* Main Weather details */}
              <div className="weather-info">
                <h2 className="city-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMapPin style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
                  {weather.name}
                </h2>
                <p className="weather-desc">
                  {weather.weather[0]?.description}
                </p>
                <div className="temp-container">
                  <span className="temperature">{Math.round(weather.main.temp)}°C</span>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Feels like: {Math.round(weather.main.feels_like ?? weather.main.temp)}°C
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Humidity: {weather.main.humidity}%
                </span>
              </div>
            </div>

            {/* Right Column: Timeline & Details */}
            <div className="forecast-panel">
              {/* Horizontal Timeline */}
              <div className="timeline-section" style={{ marginTop: 0 }}>
                <h3 className="section-title">
                  3-Hour Forecast Timeline
                </h3>
                <div className="timeline-container">
                  {forecast.list.slice(0, 16).map((item) => {
                    const isActive = selectedForecast?.dt === item.dt;
                    return (
                      <div
                        key={item.dt}
                        className={`timeline-card ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedForecast(item)}
                      >
                        <span className="time">{formatTimelineTime(item.dt)}</span>
                        <span className="time" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                          {formatTimelineDate(item.dt)}
                        </span>
                        <div className="icon-wrapper">
                          {getWeatherIcon(item.weather[0]?.main, item.weather[0]?.icon)}
                        </div>
                        <span className="temp">{Math.round(item.main.temp)}°C</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Timeline Card Details */}
              {selectedForecast && (
                <div className="selected-details-container" style={{ marginTop: 0 }}>
                  <div className="details-header">
                    <h4 className="details-title">
                      Forecast Details
                    </h4>
                    <span className="details-subtitle">
                      {formatDetailsTime(selectedForecast.dt)}
                    </span>
                  </div>

                  <div className="metric-grid">
                    {/* Temperature */}
                    <div className="metric-card">
                      <div className="icon-wrapper">
                        <WiThermometer />
                      </div>
                      <div className="info">
                        <span className="label">Temp / Feels</span>
                        <span className="value">
                          {Math.round(selectedForecast.main.temp)}° / {Math.round(selectedForecast.main.feels_like)}°
                        </span>
                      </div>
                    </div>

                    {/* Wind */}
                    <div className="metric-card">
                      <div className="icon-wrapper">
                        <FiWind />
                      </div>
                      <div className="info">
                        <span className="label">Wind Speed</span>
                        <span className="value">{selectedForecast.wind.speed} m/s</span>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="metric-card">
                      <div className="icon-wrapper">
                        <WiHumidity />
                      </div>
                      <div className="info">
                        <span className="label">Humidity</span>
                        <span className="value">{selectedForecast.main.humidity}%</span>
                      </div>
                    </div>

                    {/* Pressure */}
                    <div className="metric-card">
                      <div className="icon-wrapper">
                        <WiBarometer />
                      </div>
                      <div className="info">
                        <span className="label">Pressure</span>
                        <span className="value">{selectedForecast.main.pressure} hPa</span>
                      </div>
                    </div>

                    {/* Cloudiness */}
                    <div className="metric-card">
                      <div className="icon-wrapper">
                        <FiCloud />
                      </div>
                      <div className="info">
                        <span className="label">Cloud Cover</span>
                        <span className="value">{selectedForecast.clouds.all}%</span>
                      </div>
                    </div>

                    {/* Rain / Pop */}
                    <div className="metric-card">
                      <div className="icon-wrapper">
                        <WiRaindrops />
                      </div>
                      <div className="info">
                        <span className="label">Rain (3h) / Pop</span>
                        <span className="value">
                          {rainAmount > 0 ? `${rainAmount}mm` : snowAmount > 0 ? `${snowAmount}mm (Snow)` : '0mm'} / {Math.round(selectedForecast.pop * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial Empty State */}
        {!weather && !loading && !error && (
          <div className="empty-state">
            <div className="lottie-container" style={{ maxWidth: '200px' }}>
              {randomAnimation && <Lottie animationData={randomAnimation} loop={true} />}
            </div>
            <h2 className="empty-title">SkyCast Weather Dashboard</h2>
            <p className="empty-subtitle">
              Select one of the suggested cities above or search for a location to load real-time forecast data and dynamic timeline details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
