'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getBookings } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'

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

    if (!isReady || isLoading) return (
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-white/30 text-sm">Loading...</div>
        </div>
    )
    if (error) return (
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-red-400/60 text-sm">Error loading bookings</div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto px-6">
            <div className="mb-12 animate-fade-up">
                <p className="text-[13px] tracking-[0.2em] uppercase text-white/30 mb-3">
                    Your Reservations
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    My Bookings
                </h1>
            </div>

            {data?.data?.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center animate-fade-up animate-delay-1">
                    <p className="text-white/30 text-sm mb-4">You have no bookings yet.</p>
                    <a href="/vehicles" className="text-sm text-white/60 hover:text-white underline underline-offset-4 transition-colors">
                        Browse vehicles
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.data?.map((booking: any, i: number) => (
                        <div
                            key={booking.id}
                            className="glass-card rounded-2xl p-6 animate-fade-up"
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    <div>
                                        <p className="text-[13px] text-white/30 mb-1">Booking</p>
                                        <p className="text-white font-semibold">#{booking.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-white/30 mb-1">Dates</p>
                                        <p className="text-white text-sm">
                                            {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            {' — '}
                                            {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-white/30 mb-1">Total</p>
                                        <p className="text-white font-semibold">${booking.totalPrice}</p>
                                    </div>
                                </div>
                                <span className={`text-[11px] px-3 py-1 rounded-full ${
                                    booking.status === 'confirmed'
                                        ? 'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-400/80 border border-amber-500/20'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}