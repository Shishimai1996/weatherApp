import { CITIES } from "../lib/cities";
import ChangePrefecture from "./components/changePrefecture";

const apiKey = process.env.OPENWEATHER_API_KEY;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchWeather = async (lat: number, lon: number) => {
  console.log("DEBUG: API Key available?", !!apiKey);
  console.log("DEBUG: API Base URL available?", !!apiBaseUrl);
  if (!apiKey || !apiBaseUrl) {
    console.error("API is not applied. pls check env file.");
    return null;
  }
  const weatherUrl = `${apiBaseUrl}api/weather?lat=${lat}&lon=${lon}`;
  console.log("SERVER FETCHING URL:", weatherUrl);
  try {
    const response = await fetch(weatherUrl, { cache: "force-cache" });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERVER FETCH FAILED: ${response.status} - ${errorText}`);
      return null;
    }
    const data = await response.json();
    console.log("get data:", data);
    return data;
  } catch (error) {
    console.error("error happened when you getting data", error);
    return null;
  }
};
export default async function Home() {
  const initialCity = CITIES[0];
  const initialWeatherData = await fetchWeather(
    initialCity.lat,
    initialCity.lon
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center p-4 text-gray-100 font-sans">
      <h1 className="text-5xl font-extrabold mb-8 text-white tracking-tight drop-shadow-lg">
        現在の天気
      </h1>

      <ChangePrefecture initialWeatherData={initialWeatherData} />
    </div>
  );
}
