"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useBlogAnalyticsStats } from "@/hooks/useAnalytics";


interface AnalyticsSummaryCardsProps {
    projectId: string;
    startAt?: number;
    endAt?: number;
}

const formatDuration = (seconds: number) => {
    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ${seconds % 60}s`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours}h ${minutes % 60}m`;
};

const AnalyticsSummaryCards = ({
    projectId,
    startAt,
    endAt
}: AnalyticsSummaryCardsProps) => {

    const { data, isLoading } = useBlogAnalyticsStats({
        projectId,
        startAt,
        endAt,
    });

    const visits = data?.visits ?? 0;
    const bounces = data?.bounces ?? 0;

    const bounceRate =
        visits > 0
            ? Math.round((bounces / visits) * 100)
            : 0;

    const averageVisitDuration =
        visits > 0
            ? Math.round((data?.totaltime ?? 0) / visits)
            : 0;

    const stats = [
        {
            title: "Visitors",
            value: data?.visitors ?? 0,
        },
        {
            title: "Visits",
            value: visits,
        },
        {
            title: "Views",
            value: data?.pageviews ?? 0,
        },
        {
            title: "Bounce Rate",
            value: `${bounceRate}%`,
        },
        {
            title: "Visit Duration",
            value: formatDuration(averageVisitDuration),
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            {isLoading ? "..." : stat.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AnalyticsSummaryCards;