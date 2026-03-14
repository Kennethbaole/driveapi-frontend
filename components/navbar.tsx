'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getAccessToken, clearTokens } from '@/lib/auth'

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [token, setToken] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const t = getAccessToken()
        setToken(t)
        if (t) {
            try {
                const payload = JSON.parse(atob(t.split('.')[1]))
                setIsAdmin(payload.role === 'admin')
            } catch {}
        } else {
            setIsAdmin(false)
        }
    }, [pathname])

    function handleLogout() {
        clearTokens()
        setToken(null)
        setIsAdmin(false)
        router.push('/login')
    }

    function isActive(path: string) {
        return pathname === path ? 'text-white' : 'text-white/35 hover:text-white/70'
    }

    return (
            <nav className="glass-nav fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-8 py-3.5 rounded-2xl w-[92%] max-w-4xl"            >
            <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
                Drive<span className="text-white/25">API</span>
            </Link>

            <div className="flex gap-7 items-center">
                <Link href="/vehicles" className={`text-[13px] transition-colors duration-300 ${isActive('/vehicles')}`}>
                    Fleet
                </Link>
                {token && (
                    <Link href="/bookings" className={`text-[13px] transition-colors duration-300 ${isActive('/bookings')}`}>
                        Bookings
                    </Link>
                )}
                {token && (
                    <Link href="/profile" className={`text-[13px] transition-colors duration-300 ${isActive('/profile')}`}>
                        Profile
                    </Link>
                )}
                {isAdmin && (
                    <Link href="/admin" className={`text-[13px] transition-colors duration-300 ${isActive('/admin')}`}>
                        Admin
                    </Link>
                )}

                <div className="w-px h-4 bg-white/[0.06]" />

                {token ? (
                    <button
                        onClick={handleLogout}
                        className="text-[13px] px-4 py-1.5 rounded-xl bg-white/[0.04] text-white/35 hover:bg-white/[0.08] hover:text-white/70 transition-all duration-300 cursor-pointer border border-white/[0.04]"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="text-[13px] px-4 py-1.5 rounded-xl bg-white/[0.04] text-white/35 hover:bg-white/[0.08] hover:text-white/70 transition-all duration-300 border border-white/[0.04]"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    )
}