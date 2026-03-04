'use client'

import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '@/lib/api'

export default function VehiclesPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => getVehicles(),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading vehicles</div>

    return (
        <pre>{JSON.stringify(data, null, 2)}</pre>
    )

}