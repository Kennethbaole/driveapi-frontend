'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getVehicle, createBooking } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const token = getAccessToken()

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState('')

    const { data, isLoading, error: fetchError } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => getVehicle(Number(id)),
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (!token) {
            router.push('/login')
            return
        }

        try {
            await createBooking(Number(id), startDate, endDate)
            router.push('/bookings')
        } catch (err: any) {
            setError(err.message)
        }
    }

    if (isLoading) return <div className="p-8">Loading...</div>
    if (fetchError) return <div className="p-8">Error loading vehicle</div>

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
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

            <Card>
                <CardHeader>
                    <CardTitle>Book This Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <label className="text-sm font-medium">Start Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">End Date</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Book Now
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}