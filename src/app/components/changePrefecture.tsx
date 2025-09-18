"use client";

import { useEffect, useRef, useState } from "react";
import { CITIES, TCity } from "../../lib/cities";
import { getFormattedTime } from "../../../util/timeFomatter";

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
}

interface City {
  name: string;
  lat: number;
  lon: number;
}

interface ChangePrefectureProps {
  initialWeatherData: WeatherData | null;
}

export default function ChangePrefecture({
  initialWeatherData,
}: ChangePrefectureProps) {
  const [selectedCity, setSelectedCity] = useState<TCity>(CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(
    initialWeatherData
  );
  const [loading, setLoading] = useState(false);
  const [times, setTimes] = useState<{
    sunriseTime: string;
    sunsetTime: string;
  } | null>(
    initialWeatherData
      ? {
          sunriseTime: getFormattedTime(initialWeatherData.sys.sunrise),
          sunsetTime: getFormattedTime(initialWeatherData.sys.sunset),
        }
      : null
  );
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    async function fetchNewWeather() {
      setLoading(true);
      try {
        console.log(selectedCity);
        const response = await fetch(
          `/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setWeatherData(data);
          setTimes({
            sunriseTime: getFormattedTime(data.sys.sunrise),
            sunsetTime: getFormattedTime(data.sys.sunset),
          });
        } else {
          console.error("API Error:", data.error);
          setWeatherData(null);
        }
      } catch (error) {
        console.error("Failed to fetch weather data from client:", error);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchNewWeather();
  }, [selectedCity]);

  const iconUrl = weatherData
    ? `https://vercel.com/maishis-projects/weather-app${weatherData.weather[0].icon}@2x.png`
    : "";

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* 都市選択用のドロップダウンメニュー */}

      <div className="mb-8">
        <label
          htmlFor="city-select"
          className="block mb-2 text-lg font-medium text-gray-300"
        >
          都市を選択:
        </label>
        <select
          id="city-select"
          onChange={(e) => {
            const city = CITIES.find((c) => c.name === e.target.value);
            if (city) {
              setSelectedCity(city);
            }
          }}
          value={selectedCity.name}
          className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-3 text-lg text-white border border-white/20"
        >
          {CITIES.map((city) => (
            <option
              key={city.name}
              value={city.name}
              className="bg-gray-800 text-white"
            >
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-xl">天気情報を取得中...</p>
      ) : weatherData ? (
        <>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 text-center border border-white/20 transform hover:scale-105 transition-transform duration-300 ease-in-out max-w-lg w-full">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-around space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <img
                  src={iconUrl}
                  alt={weatherData.weather[0].description}
                  className="w-32 h-32 mr-4 filter drop-shadow-md"
                />
                <div>
                  <p className="text-5xl font-bold mb-2 leading-none">
                    {weatherData.main.temp}°C
                  </p>
                  <p className="text-xl text-gray-300 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-lg">
                  体感温度: {weatherData.main.feels_like}°C
                </p>
                <p className="text-lg">
                  最低気温: {weatherData.main.temp_min}°C
                </p>
                <p className="text-lg">
                  最高気温: {weatherData.main.temp_max}°C
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-white/15 transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <p className="text-sm text-gray-300 mb-2">湿度</p>
              <p className="text-4xl font-bold text-blue-300">
                {weatherData.main.humidity}%
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-white/15 transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <p className="text-sm text-gray-300 mb-2">風速</p>
              <p className="text-4xl font-bold text-green-300">
                {weatherData.wind.speed} m/s
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-white/15 transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <p className="text-sm text-gray-300 mb-2">気圧</p>
              <p className="text-4xl font-bold text-purple-300">
                {weatherData.main.pressure} hPa
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-white/15 transform hover:scale-105 transition-transform duration-300 ease-in-out col-span-1 sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-300 mb-2">日の出 / 日の入り</p>
              <div className="flex justify-around items-center text-xl font-bold">
                <p className="text-yellow-300">{times?.sunriseTime}</p>
                <span className="text-gray-400">|</span>
                <p className="text-orange-300">{times?.sunsetTime}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-xl text-red-400">天気情報の取得に失敗しました。</p>
      )}
    </div>
  );
}
