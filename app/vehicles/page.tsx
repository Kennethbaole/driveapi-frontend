'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function VehiclesPage() {

    const [availability, setAvailability] = useState('')
    const [make, setMake] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    function buildParams() {
        const params = new URLSearchParams()
        if (make) params.append('make', make)
        if (minPrice) params.append('minPrice', minPrice)
        if (maxPrice) params.append('maxPrice', maxPrice)
        if (availability) params.append('availability', availability)
        return params.toString()
    }

    const params = buildParams()

    const { data, isLoading, error } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => getVehicles(params),
    })

    if (isLoading) return <div className="p-8">Loading...</div>
    if (error) return <div className="p-8">Error loading vehicles</div>

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Available Vehicles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data?.map((vehicle: any) => (
                    <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                        <Card>
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
                    </Link>
                ))}
            </div>
        </div>
    )
}