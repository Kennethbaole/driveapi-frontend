'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'

export default function ProfilePage() {
    const router = useRouter()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const token = getAccessToken()
        if (!token) { router.push('/login') }
        else { setIsReady(true) }
    }, [])

    const { data, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile(),
        enabled: isReady,
    })

    if (!isReady || isLoading) return (
        <div className="max-w-2xl mx-auto px-6 relative z-10">
            <div className="flex items-center gap-3 text-white/20 text-sm py-24 justify-center animate-fade-in">
                <div className="w-4 h-4 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
                Loading profile...
            </div>
        </div>
    )

    if (error || !data) return (
        <div className="max-w-2xl mx-auto px-6 relative z-10">
            <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-red-400/60 text-sm">Could not load profile. Please log in again.</p>
            </div>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto px-6 relative z-10">
            <div className="mb-10 animate-fade-up">
                <p className="text-[12px] tracking-[0.25em] uppercase text-white/20 mb-3">Account</p>
                <h1 className="text-4xl font-bold tracking-tight text-white">Profile</h1>
            </div>

            <div className="glass-form rounded-2xl p-10 animate-fade-up animate-delay-1">
                {/* Avatar + Name */}
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                        <span className="text-3xl font-bold text-white/40">
                            {data.name ? data.name[0].toUpperCase() : data.email[0].toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{data.name || 'No name set'}</h2>
                        <span className="text-[10px] px-3 py-1 rounded-full badge-role uppercase tracking-wider">
                            {data.role}
                        </span>
                    </div>
                </div>

                <div className="divider mb-8" />

                {/* Info rows */}
                <div className="space-y-0">
                    {[
                        { label: 'Email', value: data.email },
                        { label: 'Full Name', value: data.name || '—' },
                        { label: 'Account Type', value: data.role, capitalize: true },
                        { label: 'User ID', value: `#${data.id}`, mono: true },
                    ].map((row, i) => (
                        <div
                            key={row.label}
                            className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0 animate-fade-up"
                            style={{ animationDelay: `${0.2 + i * 0.06}s` }}
                        >
                            <p className="text-[12px] text-white/20 tracking-wide">{row.label}</p>
                            <p className={`text-white ${row.mono ? 'font-mono text-sm text-white/40' : ''} ${row.capitalize ? 'capitalize' : ''}`}>
                                {row.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}