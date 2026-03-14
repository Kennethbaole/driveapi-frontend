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

        if (!token) {
            router.push('/login')
            return
        }

        try {
            await createBooking(Number(id), startDate, endDate)
            setSuccess(true)
            setTimeout(() => router.push('/bookings'), 1500)
        } catch (err: any) {
            setError(err.message)
        }
    }

    if (isLoading) return (
        <div className="max-w-2xl mx-auto px-6">
            <div className="text-white/30 text-sm">Loading...</div>
        </div>
    )
    if (fetchError) return (
        <div className="max-w-2xl mx-auto px-6">
            <div className="text-red-400/60 text-sm">Error loading vehicle</div>
        </div>
    )

    const days = startDate && endDate
        ? Math.max(0, (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0
    const totalPrice = days * (data?.pricePerDay || 0)

    return (
        <div className="max-w-2xl mx-auto px-6">
            <button
                onClick={() => router.back()}
                className="text-[13px] text-white/30 hover:text-white/60 transition-colors mb-8 cursor-pointer"
            >
                ← Back to vehicles
            </button>

            <div className="glass-card rounded-2xl p-8 mb-6 animate-fade-up">
                <p className="text-[13px] tracking-[0.2em] uppercase text-white/30 mb-2">
                    {data.make}
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
                    {data.year} {data.model}
                </h1>
                <div className="flex items-center gap-6">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${data.pricePerDay}</span>
                        <span className="text-sm text-white/30">/day</span>
                    </div>
                    <span className={`text-[11px] px-3 py-1 rounded-full ${
                        data.availability
                            ? 'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400/80 border border-red-500/20'
                    }`}>
                        {data.availability ? 'Available' : 'Unavailable'}
                    </span>
                </div>
            </div>

            {data.availability && (
                <div className="glass-form rounded-2xl p-8 animate-fade-up animate-delay-1">
                    <h2 className="text-lg font-semibold text-white mb-6">Book This Vehicle</h2>

                    {success ? (
                        <div className="text-emerald-400/80 text-sm py-4">
                            Booking confirmed! Redirecting...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <p className="text-red-400/80 text-sm px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/15">
                                    {error}
                                </p>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[13px] text-white/40 mb-2 block">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[13px] text-white/40 mb-2 block">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                                    />
                                </div>
                            </div>

                            {days > 0 && (
                                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <span className="text-sm text-white/40">{days} day{days !== 1 ? 's' : ''} × ${data.pricePerDay}</span>
                                    <span className="text-lg font-bold text-white">${totalPrice.toFixed(2)}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-300 cursor-pointer"
                            >
                                Book Now
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}