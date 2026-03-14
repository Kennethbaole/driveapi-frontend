'use client'

import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="relative z-10">
            {/* Hero */}
            <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
                <div className="animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                        <span className="text-[12px] text-white/40 tracking-wide">Now accepting bookings</span>
                    </div>
                </div>

                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 animate-fade-up animate-delay-1">
                    <span className="hero-gradient">Drive</span><span className="text-white/15">API</span>
                </h1>

                <p className="text-lg md:text-xl text-white/30 max-w-lg mb-4 animate-fade-up animate-delay-2 leading-relaxed">
                    Premium vehicles, instant booking, zero friction.
                </p>
                <p className="text-sm text-white/15 max-w-sm mb-14 animate-fade-up animate-delay-3">
                    Browse our curated fleet, pick your dates, and hit the road in minutes — not hours.
                </p>

                <div className="flex gap-4 animate-fade-up animate-delay-4">
                    <Link href="/vehicles" className="btn-primary">
                        Browse Fleet
                    </Link>
                    <Link href="/signup" className="btn-ghost">
                        Create Account
                    </Link>
                </div>
            </section>

            {/* Divider */}
            <div className="divider mx-auto max-w-4xl" />

            {/* Stats */}
            <section className="max-w-4xl mx-auto px-6 py-24">
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { value: '50+', label: 'Vehicles', sub: 'Premium fleet' },
                        { value: '24/7', label: 'Availability', sub: 'Book anytime' },
                        { value: '4.9★', label: 'Rating', sub: 'From customers' },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`glass-card stat-glow rounded-2xl p-8 text-center animate-fade-up`}
                            style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                        >
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-white/40 mb-0.5">{stat.label}</p>
                            <p className="text-[11px] text-white/20">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="divider mx-auto max-w-4xl" />

            {/* How it works */}
            <section className="max-w-4xl mx-auto px-6 py-24">
                <div className="text-center mb-16 animate-fade-up">
                    <p className="text-[12px] tracking-[0.25em] uppercase text-white/20 mb-4">Process</p>
                    <h2 className="text-3xl font-bold text-white">Three steps to the road</h2>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {[
                        { step: '01', title: 'Browse', desc: 'Explore our fleet filtered by make, price, and availability.' },
                        { step: '02', title: 'Book', desc: 'Pick your dates. Price is calculated instantly. Confirm in one click.' },
                        { step: '03', title: 'Drive', desc: 'Show up, grab the keys, and enjoy the ride.' },
                    ].map((item, i) => (
                        <div
                            key={item.step}
                            className="animate-fade-up text-center"
                            style={{ animationDelay: `${0.6 + i * 0.12}s` }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                                <span className="text-sm font-mono text-white/30">{item.step}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-white/25 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="divider mx-auto max-w-4xl" />

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-6 py-24 text-center animate-fade-up" style={{ animationDelay: '0.7s' }}>
                <h2 className="text-4xl font-bold text-white mb-4">Ready to drive?</h2>
                <p className="text-white/25 mb-10 max-w-md mx-auto">
                    Create a free account and book your first vehicle in under two minutes.
                </p>
                <Link href="/signup" className="btn-primary inline-block">
                    Get Started — It&apos;s Free
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.04] mt-12">
                <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
                    <span className="text-[13px] text-white/15">
                        © 2026 DriveAPI
                    </span>
                    <div className="flex gap-6">
                        <a href="https://github.com/Kennethbaole" target="_blank" className="text-[13px] text-white/15 hover:text-white/40 transition-colors">
                            GitHub
                        </a>
                        <a href="https://linkedin.com/in/kenneth-bao-le" target="_blank" className="text-[13px] text-white/15 hover:text-white/40 transition-colors">
                            LinkedIn
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}