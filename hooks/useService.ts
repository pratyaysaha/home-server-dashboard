'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ServicesResponse } from '@/types/service'

export function useServices() {
    return useQuery<ServicesResponse>({
        queryKey: ['services'],

        queryFn: async () => {
            const res = await api.get('/services')
            return res.data
        },

        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        staleTime: 3000,
    })
}