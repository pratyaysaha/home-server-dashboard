'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardData } from '@/types/dashboard'

export function useDashboard() {
    return useQuery<DashboardData>({
        queryKey: ['dashboard'],

        queryFn: async () => {
            const res = await api.get('/dashboard')
            return res.data
        },

        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        staleTime: 3000,
    })
}