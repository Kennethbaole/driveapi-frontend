'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createBooking, getBookings } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'

export default function BookingsPage() {

    const router = useRouter()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const token = getAccessToken()
        if (!token) {
            router.push('/login')
        } else {
            setIsReady(true)
        }
    }, [])

    const { data, isLoading, error } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => getBookings(),
        enabled: isReady,
    })

    if (!isReady || isLoading) return <div className="p-8">Loading...</div>
    if (error) return <div className="p-8">Error loading bookings</div>

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Current Bookings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data?.map((booking: any) =>(
                    <Card key={booking.id}>
                        <CardHeader>
                            <CardTitle>Booking #{booking.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-2xl font-bold mt-2">${booking.totalPrice}</p>
                            <Badge className="mt-2" variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.status}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}