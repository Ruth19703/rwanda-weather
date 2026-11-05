const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Find the coordinates of a city
export async function getCoordinates(city) {
  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error("Unable to search for the city.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" was not found.`);
  }

  return data.results[0];
}

// Get current weather
export async function getCurrentWeather(city) {
  const location = await getCoordinates(city);

  const response = await fetch(
    `${BASE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
  );

  if (!response.ok) {
    throw new Error("Unable to get current weather.");
  }

  const data = await response.json();

  return {
    city: location.name,
    country: location.country,
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    time: data.current.time
  };
}

// Get a 7-day forecast
export async function getForecast(city) {
  const location = await getCoordinates(city);

  const response = await fetch(
    `${BASE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
  );

  if (!response.ok) {
    throw new Error("Unable to get weather forecast.");
  }

  const data = await response.json();

  return {
    city: location.name,
    country: location.country,
    forecast: data.daily
  };
}