'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signup } from '@/lib/api'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signup(email, password, name)
            router.push('/login')
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 relative z-10">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10 animate-fade-up">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Create account</h1>
                    <p className="text-sm text-white/20">Start booking vehicles in minutes</p>
                </div>

                <div className="glass-form rounded-2xl p-8 animate-fade-up animate-delay-1">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10 animate-scale-in">
                                <span className="text-red-400/80 text-sm">{error}</span>
                            </div>
                        )}
                        <div>
                            <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="glass-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="glass-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[12px] text-white/25 mb-2 block tracking-wide">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="glass-input"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full text-center" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[13px] text-white/15 mt-8 animate-fade-up animate-delay-2">
                    Already have an account?{' '}
                    <Link href="/login" className="text-white/40 hover:text-white transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/30">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}