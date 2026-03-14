'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getVehicles, createVehicle, deleteVehicle } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'

export default function AdminPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [isReady, setIsReady] = useState(false)

    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')
    const [pricePerDay, setPricePerDay] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const token = getAccessToken()
        if (!token) {
            router.push('/login')
            return
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (payload.role !== 'admin') {
                router.push('/vehicles')
            } else {
                setIsReady(true)
            }
        } catch {
            router.push('/login')
        }
    }, [])

    const { data, isLoading } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => getVehicles(),
        enabled: isReady,
    })

    async function handleDelete(id: number) {
        await deleteVehicle(id)
        queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        try {
            await createVehicle({
                make,
                model,
                year: Number(year),
                pricePerDay: Number(pricePerDay),
                availability: true,
                imageUrl: imageUrl || null,
            })
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
            setMake('')
            setModel('')
            setYear('')
            setPricePerDay('')
            setImageUrl('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    if (!isReady || isLoading) return (
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-white/30 text-sm">Loading...</div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto px-6">
            <div className="mb-12 animate-fade-up">
                <p className="text-[13px] tracking-[0.2em] uppercase text-white/30 mb-3">
                    Management
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Admin Panel
                </h1>
            </div>

            <div className="glass-form rounded-2xl p-8 mb-8 animate-fade-up animate-delay-1">
                <h2 className="text-lg font-semibold text-white mb-6">Add New Vehicle</h2>
                <form onSubmit={handleCreate} className="space-y-5">
                    {error && (
                        <p className="text-red-400/80 text-sm px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/15">
                            {error}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[13px] text-white/40 mb-2 block">Make</label>
                            <input
                                placeholder="e.g. Toyota"
                                value={make}
                                onChange={(e) => setMake(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[13px] text-white/40 mb-2 block">Model</label>
                            <input
                                placeholder="e.g. Camry"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[13px] text-white/40 mb-2 block">Year</label>
                            <input
                                type="number"
                                placeholder="e.g. 2025"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[13px] text-white/40 mb-2 block">Price per Day</label>
                            <input
                                type="number"
                                placeholder="e.g. 59.99"
                                value={pricePerDay}
                                onChange={(e) => setPricePerDay(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[13px] text-white/40 mb-2 block">Image URL (optional)</label>
                        <input
                            placeholder="https://..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-300 cursor-pointer"
                    >
                        Add Vehicle
                    </button>
                </form>
            </div>

            <div className="animate-fade-up animate-delay-2">
                <h2 className="text-lg font-semibold text-white mb-4">Manage Vehicles</h2>
                <div className="space-y-3">
                    {data?.data?.map((vehicle: any) => (
                        <div key={vehicle.id} className="glass-card rounded-2xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                <p className="text-sm text-white/30">${vehicle.pricePerDay}/day</p>
                            </div>
                            <button
                                onClick={() => handleDelete(vehicle.id)}
                                className="text-[13px] px-4 py-1.5 rounded-xl bg-red-500/10 text-red-400/80 hover:bg-red-500/20 hover:text-red-400 border border-red-500/15 transition-all duration-300 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}