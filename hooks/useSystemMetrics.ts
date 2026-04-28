import { api } from "@/lib/api"
import { MetricsHistory } from "@/types/metric"
import { useQuery } from "@tanstack/react-query"

export const useMetricsHistory = (range: "1h" | "6h" | "24h" = "1h") => {

    return useQuery({
        queryKey: ["metrics-history", range],
        queryFn: async (): Promise<MetricsHistory> => {
            const res = await api.get(
                `/metrics/history?range=${range}`
            )
            return res.data
        },
        refetchInterval: 5000,
        staleTime: 0,
    })
}