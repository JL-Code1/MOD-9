import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

//Ensure API key exists
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

if (!API_KEY) {
    console.error("ERROR: Missing WEATHER_API_KEY in .env file.");
}

//Define an interface for coordinates
interface Coordinates {
    lat: number;
    lon: number;
}

// Define a class for the weather data
class Weather {
    constructor(
        public temperature: number,
        public humidity: number,
        public windSpeed: number,
        public description: string,
        public icon: string
    ) {}
}

class WeatherService {

    //Fetch latitude and longitude for a city
    static async fetchLocationData(city: string): Promise<Coordinates> {
        console.log(`🌍 Fetching location for city: ${city}`);
        
        try {
            const response = await axios.get(`${BASE_URL}/weather`, {
                params: { q: city, appid: API_KEY }
            });

            console.log(`Location for ${city}:`, response.data.coord);

            return {
                lat: response.data.coord.lat,
                lon: response.data.coord.lon
            };
        } catch (error) {
            console.error(`ERROR: Failed to fetch location for ${city}`, error);
            throw new Error("Failed to fetch city coordinates.");
        }
    }

    // ✅ Fetch current weather and 5-day forecast
    static async fetchWeatherData(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
        try {
            console.log(`🌍 Fetching weather data for: ${city}`);

            const location = await this.fetchLocationData(city);

            // ✅ Fetch current weather
            console.log(`🌤 Fetching current weather for ${city}...`);
            const currentWeatherResponse = await axios.get(`${BASE_URL}/weather`, {
                params: {
                    lat: location.lat,
                    lon: location.lon,
                    appid: API_KEY,
                    units: 'metric'
                }
            });

            // ✅ Fetch 5-day forecast
            console.log(`📅 Fetching forecast for ${city}...`);
            const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
                params: {
                    lat: location.lat,
                    lon: location.lon,
                    appid: API_KEY,
                    units: 'metric'
                }
            });

            // ✅ Parse current weather
            const currentWeather = new Weather(
                currentWeatherResponse.data.main.temp,
                currentWeatherResponse.data.main.humidity,
                currentWeatherResponse.data.wind.speed,
                currentWeatherResponse.data.weather[0].description,
                currentWeatherResponse.data.weather[0].icon
            );

            // ✅ Extract daily forecast (1 per day)
            const forecastData = forecastResponse.data.list
                .filter((_: any, index: number) => index % 8 === 0) // Every 24 hours
                .map((day: any) => new Weather(
                    day.main.temp,
                    day.main.humidity,
                    day.wind.speed,
                    day.weather[0].description,
                    day.weather[0].icon
                ));

            console.log(`✅ Weather data received for ${city}.`);

            return { current: currentWeather, forecast: forecastData };

        } catch (error) {
            console.error(`❌ ERROR: Failed to fetch weather data for ${city}`, error);
            throw new Error("Failed to fetch weather data.");
        }
    }
}

export default WeatherService;

