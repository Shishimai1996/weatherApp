import { CITIES } from "../lib/cities";
import ChangePrefecture from "./components/changePrefecture";

const apiKey = process.env.OPENWEATHER_API_KEY;

const fetchWeather = async (lat: number, lon: number) => {
  if (!apiKey) {
    console.error("API is not applied. pls check env file.");
    return null;
  }
  const weatherUrl = `https://vercel.com/maishis-projects/weather-app?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
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
