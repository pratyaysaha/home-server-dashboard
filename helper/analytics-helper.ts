import {
    AnalyticsChartPoint,
    AnalyticsDateRange,
    BlogAnalyticsPageViews,
} from "@/types/analytics";

export const transformPageViewsToChartData = (
    data?: BlogAnalyticsPageViews
): AnalyticsChartPoint[] => {
    if (!data) {
        return [];
    }

    const map = new Map<string, AnalyticsChartPoint>();

    data.pageviews.forEach((point) => {
        map.set(point.x, {
            timestamp: point.x,
            pageviews: point.y,
            sessions: 0,
        });
    });

    data.sessions.forEach((point) => {
        const existing = map.get(point.x);

        if (existing) {
            existing.sessions = point.y;
        } else {
            map.set(point.x, {
                timestamp: point.x,
                pageviews: 0,
                sessions: point.y,
            });
        }
    });

    return [...map.values()].sort(
        (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
    );
};


export const getRangeDates = (
    range: AnalyticsDateRange
) => {
    const now = new Date();

    switch (range) {
        case "today": {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            return {
                startAt: start.getTime(),
                endAt: now.getTime(),
            };
        }

        case "yesterday": {
            const start = new Date();
            start.setDate(start.getDate() - 1);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setHours(23, 59, 59, 999);

            return {
                startAt: start.getTime(),
                endAt: end.getTime(),
            };
        }

        case "last7days":
            return {
                startAt:
                    now.getTime() -
                    7 * 24 * 60 * 60 * 1000,
                endAt: now.getTime(),
            };

        case "last30days":
            return {
                startAt:
                    now.getTime() -
                    30 * 24 * 60 * 60 * 1000,
                endAt: now.getTime(),
            };

        case "alltime":
        default:
            return {
                startAt: undefined,
                endAt: undefined,
            };
    }
};