export type ChartDataItem = {
        time: string;
        temperature?: number;
        apparent?: number;
        rain?: number;
        wind?: number;

        temp_max?: number;
        temp_min?: number;
};

export type ChartType = "single" | "temperature-multi";

