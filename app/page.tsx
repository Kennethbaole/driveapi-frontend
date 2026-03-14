'use client'

import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="animate-fade-up">
                <p className="text-[13px] tracking-[0.2em] uppercase text-white/30 mb-6">
                    Car Rental Platform
                </p>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 animate-fade-up animate-delay-1">
                Drive<span className="text-white/25">API</span>
            </h1>
            <p className="text-lg text-white/40 max-w-md mb-12 animate-fade-up animate-delay-2">
                Browse premium vehicles, book instantly, and hit the road. Simple, fast, refined.
            </p>
            <div className="flex gap-4 animate-fade-up animate-delay-3">
                <Link
                    href="/vehicles"
                    className="px-8 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-300"
                >
                    Browse Vehicles
                </Link>
                <Link
                    href="/signup"
                    className="px-8 py-3 rounded-xl bg-white/[0.07] text-white/70 text-sm font-medium hover:bg-white/[0.12] hover:text-white transition-all duration-300 border border-white/[0.08]"
                >
                    Create Account
                </Link>
            </div>
        </div>
    )
}