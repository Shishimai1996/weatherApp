import ChangePrefecture from "./components/changePrefecture";

export default async function Home() {
  const initialCity = null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center p-4 text-gray-100 font-sans">
      <h1 className="text-5xl font-extrabold mb-8 text-white tracking-tight drop-shadow-lg">
        現在の天気
      </h1>

      <ChangePrefecture initialWeatherData={initialCity} />
    </div>
  );
}
