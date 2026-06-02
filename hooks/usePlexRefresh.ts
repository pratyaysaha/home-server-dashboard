'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function usePlexRefresh() {
    return useMutation({
        mutationFn: async () => {
            return api.get('/plex/refresh-all')
        },
    })
}
