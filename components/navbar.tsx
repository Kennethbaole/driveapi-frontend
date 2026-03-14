'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getAccessToken, clearTokens } from '@/lib/auth'

export default function Navbar() {
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const t = getAccessToken()
        setToken(t)
        if (t) {
            try {
                const payload = JSON.parse(atob(t.split('.')[1]))
                setIsAdmin(payload.role === 'admin')
            } catch {}
        }
    }, [pathname])

    function handleLogout() {
        clearTokens()
        setToken(null)
        setIsAdmin(false)
        router.push('/login')
    }

    return (
        <nav className="glass-nav fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-8 py-3 rounded-2xl w-[92%] max-w-4xl">
            <Link href="/" className="text-base font-semibold tracking-tight text-white">
                Drive<span className="text-white/40">API</span>
            </Link>
            <div className="flex gap-8 items-center">
                <Link href="/vehicles" className="text-[13px] text-white/50 hover:text-white transition-colors duration-300">
                    Vehicles
                </Link>
                {token && (
                    <Link href="/bookings" className="text-[13px] text-white/50 hover:text-white transition-colors duration-300">
                        Bookings
                    </Link>
                )}
                {isAdmin && (
                    <Link href="/admin" className="text-[13px] text-white/50 hover:text-white transition-colors duration-300">
                        Admin
                    </Link>
                )}
                {token ? (
                    <button
                        onClick={handleLogout}
                        className="text-[13px] px-5 py-1.5 rounded-xl bg-white/[0.07] text-white/60 hover:bg-white/[0.12] hover:text-white transition-all duration-300 cursor-pointer"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="text-[13px] px-5 py-1.5 rounded-xl bg-white/[0.07] text-white/60 hover:bg-white/[0.12] hover:text-white transition-all duration-300"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    )
}