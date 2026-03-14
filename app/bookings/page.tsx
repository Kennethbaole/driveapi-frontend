'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getBookings } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'

export default function BookingsPage() {
    const router = useRouter()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const token = getAccessToken()
        if (!token) { router.push('/login') }
        else { setIsReady(true) }
    }, [])

    const { data, isLoading, error } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => getBookings(),
        enabled: isReady,
    })

    if (!isReady || isLoading) return (
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="flex items-center gap-3 text-white/20 text-sm py-24 justify-center animate-fade-in">
                <div className="w-4 h-4 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
                Loading bookings...
            </div>
        </div>
    )

    if (error || !data) return (
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-red-400/60 text-sm">Could not load bookings. Please log in again.</p>
            </div>
        </div>
    )

    const bookings = data?.data || []

    return (
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="mb-10 animate-fade-up">
                <p className="text-[12px] tracking-[0.25em] uppercase text-white/20 mb-3">Your Reservations</p>
                <div className="flex items-end justify-between">
                    <h1 className="text-4xl font-bold tracking-tight text-white">My Bookings</h1>
                    {bookings.length > 0 && (
                        <p className="text-sm text-white/20">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
                    )}
                </div>
            </div>

            {/* Empty state */}
            {bookings.length === 0 ? (
                <div className="glass-card rounded-2xl p-16 text-center animate-fade-up animate-delay-1">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl text-white/15">🚗</span>
                    </div>
                    <p className="text-white/25 text-sm mb-2">No reservations yet</p>
                    <p className="text-white/12 text-sm mb-6">Browse our fleet and book your first ride</p>
                    <Link href="/vehicles" className="btn-primary inline-block text-center">
                        Browse Vehicles
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking: any, i: number) => (
                        <div
                            key={booking.id}
                            className="glass-card rounded-2xl p-6 animate-fade-up"
                            style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-10">
                                    <div className="min-w-[60px]">
                                        <p className="text-[11px] text-white/15 mb-1">Booking</p>
                                        <p className="text-white font-semibold font-mono">#{booking.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-white/15 mb-1">Dates</p>
                                        <p className="text-white text-sm">
                                            {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            <span className="text-white/15 mx-2">→</span>
                                            {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-white/15 mb-1">Total</p>
                                        <p className="text-white font-semibold">${booking.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-3 py-1.5 rounded-full ${
                                    booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'
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