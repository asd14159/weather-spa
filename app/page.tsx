"use client";
import { WeatherControls } from "@/components/WeatherControls";
import { WeatherChart } from "@/components/WeatherChart";
import { LoadingView } from "@/components/LoadingView";
import { ErrorView } from "@/components/ErrorView";
import { useWeather } from "./hooks/useWeather";

export default function Page() {
    const {
        city,
        period,

        hourlyMetricBase,
        hourlyMetricDetail,
        dailyMetric,

        data,
        unit,

        loading,
        error,

        setCity,
        setPeriod,
        setHourlyMetricBase,
        setHourlyMetricDetail,
        setDailyMetric,

        refetch,
    } = useWeather();

    if(loading) return <LoadingView/>
    if(error) return <ErrorView message={error} onRetry={refetch}/>;

    return(
        <>
            <WeatherControls
                city = {city}
                period={period}
                hourlyMetricBase = {hourlyMetricBase}
                hourlyMetricDetail = {hourlyMetricDetail}
                dailyMetric = {dailyMetric}
                onCityChange={setCity}
                onPeriodChange={setPeriod}
                onHourlyMetricBaseChange={setHourlyMetricBase}
                onHourlyMetricDetailChange={setHourlyMetricDetail}                
                onDailyMetricChange={setDailyMetric}
            />

            <WeatherChart 
                title = {
                    period === "48h"
                        ? `48時間データ`
                        : `7日間データ`
                }
                data = {data}
                unit={unit}
            />
        </>
    );
}