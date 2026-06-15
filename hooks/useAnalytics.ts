"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import {
    AnalyticsFilters,
    AnalyticsMetric,
    AnalyticsMetricType,
    AnalyticsPageViewFilters,
    BlogAnalyticsPageViews,
    BlogAnalyticsStats,
    UseBlogAnalyticsMetricsParams,
    UseBlogAnalyticsPageViewsParams,
    UseBlogAnalyticsStatsParams,
} from "@/types/analytics";

export const analyticsKeys = {
    all: ["analytics"] as const,

    stats: (
        projectId: string,
        filters?: AnalyticsFilters
    ) => [
        "analytics",
        "stats",
        projectId,
        filters,
    ] as const,

    pageviews: (
        projectId: string,
        filters?: AnalyticsPageViewFilters
    ) => [
        "analytics",
        "pageviews",
        projectId,
        filters,
    ] as const,

    metrics: (
        projectId: string,
        type: AnalyticsMetricType,
        filters?: AnalyticsFilters
    ) => [
        "analytics",
        "metrics",
        projectId,
        type,
        filters,
    ] as const,
};

const QUERY_OPTIONS = {
    staleTime: 60_000,
    gcTime: 5 * 60_000,
} as const;

/* -------------------------------------------------------------------------- */
/*                                    STATS                                   */
/* -------------------------------------------------------------------------- */

const fetchBlogAnalyticsStats = async ({
    projectId,
    ...filters
}: UseBlogAnalyticsStatsParams): Promise<BlogAnalyticsStats> => {
    const response = await api.get(
        `/analytics/blog/project/${projectId}/stats`,
        {
            params: filters,
        }
    );

    return response.data.data;
};

export const useBlogAnalyticsStats = (
    params: UseBlogAnalyticsStatsParams
) => {
    const { projectId, ...filters } = params;

    return useQuery({
        queryKey: analyticsKeys.stats(projectId, filters),
        queryFn: () => fetchBlogAnalyticsStats(params),
        ...QUERY_OPTIONS,
    });
};

/* -------------------------------------------------------------------------- */
/*                                 PAGE VIEWS                                 */
/* -------------------------------------------------------------------------- */

const fetchBlogAnalyticsPageViews = async ({
    projectId,
    ...filters
}: UseBlogAnalyticsPageViewsParams): Promise<BlogAnalyticsPageViews> => {
    const response = await api.get(
        `/analytics/blog/project/${projectId}/page-views`,
        {
            params: filters,
        }
    );

    return response.data.data;
};

export const useBlogAnalyticsPageViews = (
    params: UseBlogAnalyticsPageViewsParams
) => {
    const { projectId, ...filters } = params;

    return useQuery({
        queryKey: analyticsKeys.pageviews(projectId, filters),
        queryFn: () => fetchBlogAnalyticsPageViews(params),
        ...QUERY_OPTIONS,
    });
};

/* -------------------------------------------------------------------------- */
/*                                   METRICS                                  */
/* -------------------------------------------------------------------------- */

const fetchBlogAnalyticsMetrics = async ({
    projectId,
    ...filters
}: UseBlogAnalyticsMetricsParams): Promise<AnalyticsMetric[]> => {
    const response = await api.get(
        `/analytics/blog/project/${projectId}/metrics`,
        {
            params: filters,
        }
    );

    return response.data.data;
};

export const useBlogAnalyticsMetrics = (
    params: UseBlogAnalyticsMetricsParams
) => {
    const { projectId, type, ...filters } = params;

    return useQuery({
        queryKey: analyticsKeys.metrics(
            projectId,
            type,
            filters
        ),
        queryFn: () => fetchBlogAnalyticsMetrics(params),
        ...QUERY_OPTIONS,
    });
};