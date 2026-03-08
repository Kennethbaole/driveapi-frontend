'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVehicle } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const { data, isLoading, error } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => getVehicle(Number(id)),
    })

    if (isLoading) return <div className="p-8">Loading...</div>
    if (error) return <div className="p-8">Error loading vehicle</div>

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">
                        {data.year} {data.make} {data.model}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-3xl font-bold">${data.pricePerDay}/day</p>
                    <Badge variant={data.availability ? 'default' : 'secondary'}>
                        {data.availability ? 'Available' : 'Unavailable'}
                    </Badge>
                </CardContent>
            </Card>
        </div>
    )
}