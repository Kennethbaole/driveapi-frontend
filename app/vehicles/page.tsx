'use client'

import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function VehiclesPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => getVehicles(),
    })

    if (isLoading) return <div className="p-8">Loading...</div>
    if (error) return <div className="p-8">Error loading vehicles</div>

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Available Vehicles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data?.map((vehicle: any) => (
                    <Card key={vehicle.id}>
                        <CardHeader>
                            <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${vehicle.pricePerDay}/day</p>
                            <Badge className="mt-2" variant={vehicle.availability ? 'default' : 'secondary'}>
                                {vehicle.availability ? 'Available' : 'Unavailable'}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}