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

    return (
        <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12 animate-fade-up">
                <p className="text-[13px] tracking-[0.2em] uppercase text-white/30 mb-3">
                    Our Fleet
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Available Vehicles
                </h1>
            </div>

            <div className="flex gap-3 mb-10 animate-fade-up animate-delay-1">
                <input
                    type="text"
                    placeholder="Filter by make..."
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors w-48"
                />
                <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors w-36"
                />
                <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors w-36"
                />
            </div>

            {isLoading && (
                <div className="text-white/30 text-sm">Loading vehicles...</div>
            )}
            {error && (
                <div className="text-red-400/60 text-sm">Error loading vehicles</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data?.data?.map((vehicle: any, i: number) => (
                    <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                        <div className={`glass-card rounded-2xl p-6 cursor-pointer animate-fade-up`}
                             style={{ animationDelay: `${(i % 6) * 0.08}s` }}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-[13px] text-white/30 mb-1">{vehicle.make}</p>
                                    <h3 className="text-lg font-semibold text-white">
                                        {vehicle.year} {vehicle.model}
                                    </h3>
                                </div>
                                <span className={`text-[11px] px-3 py-1 rounded-full ${
                                    vehicle.availability
                                        ? 'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400/80 border border-red-500/20'
                                }`}>
                                    {vehicle.availability ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">${vehicle.pricePerDay}</span>
                                <span className="text-sm text-white/30">/day</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}