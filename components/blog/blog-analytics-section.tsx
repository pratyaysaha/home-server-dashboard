"use client";

import { BarChart3 } from "lucide-react";


import EmptyState from "../common/empty-state";
import AnalyticsSummaryCards from "./analytics-summary-card";
import AnalyticsTrafficChart from "./analytics-traffic-chart";
import { useState } from "react";
import { AnalyticsDateRange, AnalyticsUnit } from "@/types/analytics";
import { getRangeDates } from "@/helper/analytics-helper";

interface BlogAnalyticsSectionProps {
    projectId: string;
    isPublished: boolean;
}

const BlogAnalyticsSection = ({
    projectId,
    isPublished,
}: BlogAnalyticsSectionProps) => {

    const [unit, setUnit] = useState<AnalyticsUnit>("day");
    const [range, setRange] = useState<AnalyticsDateRange>("alltime");
    const { startAt, endAt } = getRangeDates(range);

    if (!isPublished) {
        return (
            <EmptyState
                title="Publish your blog post to view analytics"
                description="Analytics become available after a blog post is published. Publish the selected draft to start tracking visitors, visits, pageviews and engagement."
                icon={BarChart3}
            />
        );
    }

    return (
        <div className="space-y-6">
            <AnalyticsSummaryCards
                projectId={projectId}
                startAt={startAt}
                endAt={endAt}

            />

            <AnalyticsTrafficChart
                projectId={projectId}
                range={range}
                onRangeChange={setRange}
                unit={unit}
                onUnitChange={setUnit}
                startAt={startAt}
                endAt={endAt}
            />
        </div>
    );
};

export default BlogAnalyticsSection;