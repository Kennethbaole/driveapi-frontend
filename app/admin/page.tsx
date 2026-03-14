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
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        const token = getAccessToken()
        if (!token) { router.push('/login'); return }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (payload.role !== 'admin') { router.push('/vehicles') }
            else { setIsReady(true) }
        } catch { router.push('/login') }
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
        setSuccessMsg('')
        try {
            await createVehicle({
                make, model,
                year: Number(year),
                pricePerDay: Number(pricePerDay),
                availability: true,
                imageUrl: imageUrl || null,
            })
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
            setMake(''); setModel(''); setYear(''); setPricePerDay(''); setImageUrl('')
            setSuccessMsg('Vehicle added successfully')
            setTimeout(() => setSuccessMsg(''), 3000)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const vehicles = data?.data || []

    if (!isReady || isLoading) return (
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="flex items-center gap-3 text-white/20 text-sm py-24 justify-center animate-fade-in">
                <div className="w-4 h-4 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
                Loading...
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="mb-10 animate-fade-up">
                <p className="text-[12px] tracking-[0.25em] uppercase text-white/20 mb-3">Management</p>
                <h1 className="text-4xl font-bold tracking-tight text-white">Admin Panel</h1>
            </div>

            {/* Create Form */}
            <div className="glass-form rounded-2xl p-10 mb-10 animate-fade-up animate-delay-1">
                <h2 className="text-xl font-semibold text-white mb-8">Add New Vehicle</h2>
                <form onSubmit={handleCreate} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10 animate-scale-in">
                            <span className="text-red-400/80 text-sm">{error}</span>
                        </div>
                    )}
                    {successMsg && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 animate-scale-in">
                            <span className="text-emerald-400/80 text-sm">{successMsg}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Make</label>
                            <input placeholder="e.g. Toyota" value={make} onChange={(e) => setMake(e.target.value)} className="glass-input" required />
                        </div>
                        <div>
                            <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Model</label>
                            <input placeholder="e.g. Camry" value={model} onChange={(e) => setModel(e.target.value)} className="glass-input" required />
                        </div>
                        <div>
                            <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Year</label>
                            <input type="number" placeholder="e.g. 2025" value={year} onChange={(e) => setYear(e.target.value)} className="glass-input" required />
                        </div>
                        <div>
                            <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Price / Day</label>
                            <input type="number" placeholder="e.g. 59.99" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} className="glass-input" required />
                        </div>
                    </div>
                    <div>
                        <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Image URL (optional)</label>
                        <input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="glass-input" />
                    </div>
                    <button type="submit" className="btn-primary text-center">
                        Add Vehicle
                    </button>
                </form>
            </div>

            {/* Vehicle List */}
            <div className="animate-fade-up animate-delay-2">
                <div className="flex items-end justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Fleet Management</h2>
                    <p className="text-sm text-white/20">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="space-y-3">
                    {vehicles.map((vehicle: any, i: number) => (
                        <div
                            key={vehicle.id}
                            className="glass-card rounded-2xl p-5 flex items-center justify-between animate-fade-up"
                            style={{ animationDelay: `${0.3 + i * 0.04}s` }}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                    <span className="text-sm font-mono text-white/20">#{vehicle.id}</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                    <p className="text-[12px] text-white/20">${vehicle.pricePerDay}/day</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(vehicle.id)} className="btn-danger">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}