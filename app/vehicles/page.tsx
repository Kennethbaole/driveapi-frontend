'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '@/lib/api'

export default function VehiclesPage() {
    const [make, setMake] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    function buildParams() {
        const params = new URLSearchParams()
        if (make) params.append('make', make)
        if (minPrice) params.append('minPrice', minPrice)
        if (maxPrice) params.append('maxPrice', maxPrice)
        return params.toString()
    }

    const params = buildParams()

    const { data, isLoading, error } = useQuery({
        queryKey: ['vehicles', params],
        queryFn: () => getVehicles(params),
    })

    const vehicles = data?.data || []
    const total = data?.meta?.total || 0

    return (
        <div className="max-w-6xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="mb-10 animate-fade-up">
                <p className="text-[12px] tracking-[0.25em] uppercase text-white/20 mb-3">Our Fleet</p>
                <div className="flex items-end justify-between">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Available Vehicles
                    </h1>
                    {!isLoading && (
                        <p className="text-sm text-white/20">{total} vehicle{total !== 1 ? 's' : ''}</p>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="glass-form rounded-2xl p-5 mb-10 animate-fade-up animate-delay-1">
                <div className="flex gap-3 items-center">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by make..."
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            className="glass-input"
                        />
                    </div>
                    <div className="w-40">
                        <input
                            type="number"
                            placeholder="Min $/day"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="glass-input"
                        />
                    </div>
                    <div className="w-40">
                        <input
                            type="number"
                            placeholder="Max $/day"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="glass-input"
                        />
                    </div>
                    {(make || minPrice || maxPrice) && (
                        <button
                            onClick={() => { setMake(''); setMinPrice(''); setMaxPrice(''); }}
                            className="text-[12px] text-white/25 hover:text-white/50 transition-colors px-3 cursor-pointer"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center gap-3 text-white/20 text-sm py-12 justify-center animate-fade-in">
                    <div className="w-4 h-4 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
                    Loading vehicles...
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="glass-card rounded-2xl p-8 text-center">
                    <p className="text-red-400/60 text-sm">Something went wrong loading vehicles.</p>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && vehicles.length === 0 && (
                <div className="glass-card rounded-2xl p-16 text-center animate-fade-up animate-delay-2">
                    <p className="text-white/25 text-sm mb-2">No vehicles match your filters.</p>
                    <button
                        onClick={() => { setMake(''); setMinPrice(''); setMaxPrice(''); }}
                        className="text-sm text-white/40 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {vehicles.map((vehicle: any, i: number) => (
                    <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                        <div
                            className="glass-card rounded-2xl p-6 cursor-pointer animate-fade-up"
                            style={{ animationDelay: `${0.2 + (i % 9) * 0.06}s` }}
                        >
                            {/* Top row */}
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <p className="text-[11px] tracking-wider uppercase text-white/20 mb-1.5">{vehicle.make}</p>
                                    <h3 className="text-lg font-semibold text-white leading-tight">
                                        {vehicle.model}
                                    </h3>
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full ${
                                    vehicle.availability ? 'badge-available' : 'badge-unavailable'
                                }`}>
                                    {vehicle.availability ? 'Available' : 'Booked'}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="divider mb-5" />

                            {/* Bottom row */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[11px] text-white/15 mb-0.5">From</p>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-2xl font-bold text-white">${vehicle.pricePerDay}</span>
                                        <span className="text-xs text-white/20">/day</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-white/15">
                                    <span>{vehicle.year}</span>
                                    <span className="text-white/8">•</span>
                                    <span>Auto</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}