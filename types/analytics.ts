export type AnalyticsUnit =
    | "minute"
    | "hour"
    | "day"
    | "month"
    | "year";

export type AnalyticsMetricType =
    | "referrer"
    | "country"
    | "browser"
    | "os"
    | "device"
    | "city"
    | "region"
    | "event"
    | "url"
    | "title";

export interface AnalyticsFilters {
    startAt?: number;
    endAt?: number;

    url?: string;
    referrer?: string;
    title?: string;
    query?: string;
    event?: string;

    os?: string;
    browser?: string;
    device?: string;

    country?: string;
    region?: string;
    city?: string;

    tag?: string;
}

export interface AnalyticsPageViewFilters
    extends AnalyticsFilters {
    unit?: AnalyticsUnit;
    timezone?: string;
}

export interface AnalyticsMetricsFilters
    extends AnalyticsFilters {
    type: AnalyticsMetricType;
    limit?: number;
}

export interface BlogAnalyticsStats {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
}

export interface BlogAnalyticsStatsResponse {
    data: BlogAnalyticsStats;
}

export interface AnalyticsDataPoint {
    x: string;
    y: number;
}

export interface BlogAnalyticsPageViews {
    pageviews: AnalyticsDataPoint[];
    sessions: AnalyticsDataPoint[];
}

export interface BlogAnalyticsPageViewsResponse {
    data: BlogAnalyticsPageViews;
}

export interface AnalyticsChartPoint {
    timestamp: string;
    pageviews: number;
    sessions: number;
}

export interface AnalyticsMetric {
    x: string;
    y: number;
}

export interface BlogAnalyticsMetricsResponse {
    data: AnalyticsMetric[];
}

export interface UseBlogAnalyticsStatsParams
    extends AnalyticsFilters {
    projectId: string;
    startAt?: number;
    endAt?: number;
}

export interface UseBlogAnalyticsPageViewsParams
    extends AnalyticsPageViewFilters {
    projectId: string;
}

export interface UseBlogAnalyticsMetricsParams
    extends AnalyticsMetricsFilters {
    projectId: string;
}

export type AnalyticsDateRange =
    | "today"
    | "yesterday"
    | "last7days"
    | "last30days"
    | "last90days"
    | "alltime";