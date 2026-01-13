"use client";
import { WeatherControls } from "@/components/WeatherControls";
import { WeatherChart } from "@/components/WeatherChart";
import { LoadingView } from "@/components/LoadingView";
import { ErrorView } from "@/components/ErrorView";
import { useWeather } from "./hooks/useWeather";
import { ChartDataItem } from "./types/chart";


export default function Page() {
    const {
        city,
        period,
        hourlyMetric,
        dailyMetric,
        data,
        unit,
        loading,
        error,
        setCity,
        setPeriod,
        setHourlyMetric,
        setDailyMetric,
        refetch,
    } = useWeather();

    const chartData: ChartDataItem[] = data.map((value, index) => ({
        time:
        period === "48h"
            ? `${index + 1}h`
            : `${index + 1}日`,
        value,
    }));

    const legendName =
      period === "48h"
        ? hourlyMetric === "temperature"
            ? "気温"
            : hourlyMetric === "apparent"
                ? "体感温度"
                : hourlyMetric === "rain"
                    ? "降水量"
                    : "風速"
        : dailyMetric === "temp_max"
          ? "最高気温"
          : "最低気温";

    if(loading) return <LoadingView/>
    if(error) return <ErrorView message={error} onRetry={refetch}/>;

    return(
        <>
            <WeatherControls
                city = {city}
                period={period}
                hourlyMetric={hourlyMetric}
                dailyMetric={dailyMetric}
                onCityChange={setCity}
                onPeriodChange={setPeriod}
                onHourlyMetricChange={setHourlyMetric}
                onDailyMetricChange={setDailyMetric}
            />

            <WeatherChart 
                title = {
                    period === "48h"
                        ? `48時間データ(${hourlyMetric})`
                        : `7日間データ(${dailyMetric})`
                }
                data = {chartData}
                unit={unit}
                legendName={legendName}
            />
        </>
    );
}