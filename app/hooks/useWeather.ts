"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { 
  City, 
  Period,
  DailyMetric, 
  HourlyData, 
  DailyData,
  HourlyMetricBase,
  HourlyMetricDetail,
 } from "types/weather";
import { ChartType, ChartDataItem } from "types/chart";

export function useWeather() {
  const [city, setCity] = useState<City>("東京");
  const [period, setPeriod] = useState<Period>("48h");

  const [hourlyMetricBase, setHourlyMetricBase] = useState<HourlyMetricBase>("temperature");
  const [hourlyMetricDetail, setHourlyMetricDetail] = useState<HourlyMetricDetail[]>(["temperature"]);

  const [dailyMetric, setDailyMetric] = useState<DailyMetric[]>(["temp_max"]);

  const [hourlyData, setHourlyData] = useState<HourlyData | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);  

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);

  const cities: Record<City, { lat:number; lon:number }> = {
    東京: { lat: 35.6895, lon: 139.6917 },
    大阪: { lat: 34.6937, lon: 135.5023 },
    札幌: { lat: 43.0642, lon: 141.3469 },
    福岡: { lat: 33.5902, lon: 130.4017 },
    那覇: { lat: 26.2124, lon: 127.6809 }
  }

  useEffect(() => {
    if(period === "48h") {
      setDailyMetric(["temp_max"]);
    } else {
      setHourlyMetricBase("temperature");
      setHourlyMetricDetail(["temperature"]);
    }
  }, [period]);

  const hourlyParams = useMemo(() => {
    if(hourlyMetricBase === "temperature"){
      return hourlyMetricDetail.map((m) =>
        m === "temperature"
          ? "temperature_2m"
          : "apparent_temperature"
      )
      .join(",");
    }
  

    if(hourlyMetricBase === "rain") {
      return "precipitation";
    }

    if(hourlyMetricBase === "wind") {
      return "wind_speed_10m";
    }

    return "";
  }, [hourlyMetricBase, hourlyMetricDetail]);

  //callbackで関数のメモ化[city,priod]が変わったときだけ新しい関数を作る
  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { lat, lon } = cities[city];

    const url =
        period === "48h"
            ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&timezone=auto`
            : `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
      const res = await fetch(url);
      if(!res.ok){
        if(res.status === 429) {
          throw new Error("アクセスが集中しています。しばらくして再試行してください。");
        }
        throw new Error("サーバーエラーが発生しました");
      }
      const json = await res.json();
      if(period === "48h"){
        setHourlyData(json.hourly);
        setDailyData(null);
      } else {
        setDailyData(json.daily);
        setHourlyData(null);
      }
    } catch(e) {
      if(e instanceof Error){
        setError(e.message);
      } else {
        setError("不明なエラーが発生しました")
      }
    } finally {
      setLoading(false);
    }
  },[city,period, hourlyParams]);

  useEffect(() => {
    fetchWeather();
  },[fetchWeather]);

  const chartType: ChartType =
    period === "48h" &&
    hourlyMetricBase === "temperature" &&
    hourlyMetricDetail.length > 1
      ? "temperature-multi"
      : "single";

   const data: ChartDataItem[] = useMemo(() => {
    if (period === "48h" && hourlyData) {
      return hourlyData.time.slice(0, 48).map((time, i) => {
        const item: ChartDataItem = { time };

        if (hourlyMetricBase === "temperature") {
          if (hourlyMetricDetail.includes("temperature")) {
            item.temperature = hourlyData.temperature_2m[i];
          }
          if (hourlyMetricDetail.includes("apparent")) {
            item.apparent = hourlyData.apparent_temperature[i];
          }
        }

        if (hourlyMetricBase === "rain") {
          item.rain = hourlyData.precipitation[i];
        }

        if (hourlyMetricBase === "wind") {
          item.wind = hourlyData.wind_speed_10m[i];
        }

        return item;
      });
    }

    if (period === "7d" && dailyData) {
      return dailyData.time.map((time, i) => {
        const item: ChartDataItem = { time };

        if (dailyMetric.includes("temp_max")) {
          item.temp_max = dailyData.temperature_2m_max[i];
        }
        if (dailyMetric.includes("temp_min")) {
          item.temp_min = dailyData.temperature_2m_min[i];
        }

        return item;
      });
    }

    return [];
  }, [
    period,
    hourlyData,
    dailyData,
    hourlyMetricBase,
    hourlyMetricDetail,
    dailyMetric,
  ]);

  const unit =
    period === "48h"
      ? hourlyMetricBase === "temperature"
        ? "℃"
        : hourlyMetricBase === "rain"
          ? "mm"
          : "m/s"
      : "℃";

  return {
    city,
    setCity,
    period,
    setPeriod,

    hourlyMetricBase,
    setHourlyMetricBase,
    hourlyMetricDetail,
    setHourlyMetricDetail,

    dailyMetric,
    setDailyMetric,

    chartType,
    data,
    unit,

    loading,
    error,

    refetch: fetchWeather,
  };
}
