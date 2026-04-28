'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useServerStatus() {
    return useQuery({
        queryKey: ['server-status'],

        queryFn: async () => {
            const res = await api.get('/ping')
            return res.data
        },

        retry: false,

        refetchInterval: 5000,
        refetchOnWindowFocus: true,
    })
}