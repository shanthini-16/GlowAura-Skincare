import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Droplets, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { wellnessAPI } from '../services/api';

const WeatherAlertWidget = () => {
  const [weatherData, setWeatherData] = useState({
    city: 'Mumbai / Pan-India',
    uv_index: 7.8,
    uv_status: 'Very High',
    humidity: '74%',
    temperature: '31°C',
    weather_condition: 'High Solar Irradiance & Humidity',
    recommendation: 'Extreme UV Index active! UVA photodamage accelerates melanin and breakdown of collagen elastin. Reapply SPF 50 every 2 hours and use a weightless gel hydration matrix.'
  });

  useEffect(() => {
    wellnessAPI.getWeatherAdvice('Mumbai')
      .then(res => {
        if (res.data) setWeatherData(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-glow-primary/10 border border-pink-200 dark:border-pink-900/40 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Sun size={18} className="animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
              UV Photoprotection Shield
            </span>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {weatherData.city} ({weatherData.temperature})
            </h4>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-black text-red-500 bg-red-100 dark:bg-red-950/60 px-2.5 py-0.5 rounded-full">
            UV Index: {weatherData.uv_index} ({weatherData.uv_status})
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
        {weatherData.recommendation}
      </p>

      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1 border-t border-pink-200/40">
        <span>Humidity: <strong>{weatherData.humidity}</strong></span>
        <span className="flex items-center gap-1 text-glow-primary font-bold">
          <ShieldCheck size={13} /> Broad-Spectrum Protection Advised
        </span>
      </div>
    </div>
  );
};

export default WeatherAlertWidget;
