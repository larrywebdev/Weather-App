import { useState } from "react";
import { FiSearch } from "react-icons/fi";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const response_1 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      const data_1 = await response_1.json();
      if (response.ok && response_1.ok) {
        setWeather(data);
        setForecast(data_1);
        setCity("");
      } else {
        setError(data.message);
        setWeather(null);
        setForecast(null); // e.g. "city not found"
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Something went wrong.");
      setWeather(null);
      setForecast(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-100 flex flex-col items-center p-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">🌤️ Weather</h1>
      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full shadow px-4 py-2 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow outline-none px-2"
        />
        <FiSearch
          className="text-xl text-blue-600 cursor-pointer"
          onClick={getWeather}
        />
      </div>
      <p className="text-lg text-gray-700 font-medium">
        {weather || loading || error ? "" : "Feeling good?"}
      </p>
      {loading && <p className="text-gray-700 mb-4">Loading...</p>}
      {error && <p className="text-gray-700 mb-4 capitalize">{error}!</p>}
      {/* Current Weather */}
      {weather && (
        <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center mb-6">
          <h2 className="text-xl font-semibold">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-4xl font-bold my-2">
            {Math.round(weather.main.temp)}°C
          </p>

          <p className="text-gray-500 capitalize">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-16 h-16 mx-auto"
            />
            <span>{weather.weather[0].description}</span>
          </p>
          <p className="text-sm mt-2">
            Feels like {Math.round(weather.main.feels_like)}°C • Humidity:{" "}
            {weather.main.humidity}% • Wind: {Math.round(weather.wind.speed)}{" "}
            km/h
          </p>
        </div>
      )}

      {/* Forecast */}
      {forecast && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">5-Day Forecast</h3>
          <div className="flex overflow-x-auto space-x-4">
            {forecast.list
              .filter((item) => item.dt_txt.includes("12:00:00"))
              .slice(0, 5)
              .map((dailyForecast, id) => (
                <div
                  key={id}
                  className="flex-shrink-0 w-30 bg-white rounded-xl shadow p-4 text-center"
                >
                  <p className="font-bold  pb-[5px]">
                    {new Date(dailyForecast.dt * 1000).toLocaleDateString(
                      "en-US",
                      { weekday: "long" }
                    )}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`}
                    alt={dailyForecast.weather[0].description}
                    className="w-16 h-16 mx-auto"
                  />
                  <p className="font-medium  pb-[5px]">
                    {Math.round(dailyForecast.main.temp)}°C
                  </p>
                  <p className="text-xs pb-[5px]">
                    Humidity: {dailyForecast.main.humidity}%
                  </p>
                  <p className="text-xs">
                    Wind: {Math.round(dailyForecast.wind.speed)} km/h
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
