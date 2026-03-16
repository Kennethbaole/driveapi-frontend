'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getVehicle, createBooking } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const token = getAccessToken()

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const { data, isLoading, error: fetchError } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => getVehicle(Number(id)),
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (!token) { router.push('/login'); return }
        try {
            await createBooking(Number(id), startDate, endDate)
            setSuccess(true)
            setTimeout(() => router.push('/bookings'), 1500)
        } catch (err: any) {
            setError(err.message)
        }
    }

    if (isLoading) return (
        <div className="max-w-3xl mx-auto px-6 relative z-10">
            <div className="flex items-center gap-3 text-white/20 text-sm py-24 justify-center animate-fade-in">
                <div className="w-4 h-4 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
                Loading...
            </div>
        </div>
    )

    if (fetchError) return (
        <div className="max-w-3xl mx-auto px-6 relative z-10">
            <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-red-400/60 text-sm">Could not load this vehicle.</p>
            </div>
        </div>
    )

    const days = startDate && endDate
        ? Math.max(0, (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0
    const totalPrice = days * (data?.pricePerDay || 0)

    return (
        <div className="max-w-3xl mx-auto px-6 relative z-10">
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="text-[12px] text-white/20 hover:text-white/50 transition-colors mb-10 cursor-pointer flex items-center gap-2 animate-fade-up"
            >
                <span>←</span> Back to fleet
            </button>

            {/* Vehicle Detail */}
            <div className="glass-card rounded-2xl overflow-hidden mb-6 animate-fade-up animate-delay-1">
                {data.imageUrl && (
                    <div className="h-64 overflow-hidden">
                        <img
                            src={data.imageUrl}
                            alt={`${data.make} ${data.model}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="p-10">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <p className="text-[11px] tracking-[0.25em] uppercase text-white/20">{data.make}</p>
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full badge-role">{data.category}</span>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight text-white mb-1">{data.model}</h1>
                            <p className="text-sm text-white/15">{data.year} Model Year</p>
                        </div>
                        <span className={`text-[10px] px-3 py-1.5 rounded-full ${
                            data.availability ? 'badge-available' : 'badge-unavailable'
                        }`}>
                            {data.availability ? 'Available' : 'Unavailable'}
                        </span>
                    </div>

                    <div className="divider mb-8" />

                    <div className="grid grid-cols-5 gap-4">
                        <div>
                            <p className="text-[11px] text-white/15 mb-1">Daily Rate</p>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-2xl font-bold text-white">${data.pricePerDay}</span>
                                <span className="text-xs text-white/20">/day</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-white/15 mb-1">Year</p>
                            <p className="text-lg font-semibold text-white">{data.year}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-white/15 mb-1">Seats</p>
                            <p className="text-lg font-semibold text-white">{data.seats}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-white/15 mb-1">Transmission</p>
                            <p className="text-lg font-semibold text-white">{data.transmission}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-white/15 mb-1">Fuel</p>
                            <p className="text-lg font-semibold text-white">{data.fuelType}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Form */}
            {data.availability && (
                <div className="glass-form rounded-2xl p-10 animate-fade-up animate-delay-2">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold text-white">Reserve This Vehicle</h2>
                        {days > 0 && (
                            <span className="text-sm text-white/25">{days} day{days !== 1 ? 's' : ''} selected</span>
                        )}
                    </div>

                    {success ? (
                        <div className="flex items-center gap-3 py-6 animate-scale-in">
                            <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <span className="text-emerald-400">✓</span>
                            </span>
                            <div>
                                <p className="text-white font-medium">Booking confirmed</p>
                                <p className="text-sm text-white/30">Redirecting to your bookings...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10 animate-scale-in">
                                    <span className="text-red-400/80 text-sm">{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Pick-up Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="glass-input"
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Return Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="glass-input"
                                    />
                                </div>
                            </div>

                            {days > 0 && (
                                <div className="glass-card rounded-xl p-5 animate-scale-in">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-white/25">
                                            {days} day{days !== 1 ? 's' : ''} × ${data.pricePerDay}/day
                                        </span>
                                    </div>
                                    <div className="divider mb-3" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white/40 font-medium">Total</span>
                                        <span className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="w-full py-3.5 rounded-xl bg-white text-[#0a0a0f] text-sm font-medium hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer">
                                Confirm Reservation
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}