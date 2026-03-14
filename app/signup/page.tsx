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
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        try {
            await signup(email, password, name)
            router.push('/login')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-sm animate-fade-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create account</h1>
                    <p className="text-sm text-white/30">Start booking vehicles today</p>
                </div>

                <div className="glass-form rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <p className="text-red-400/80 text-sm px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/15">
                                {error}
                            </p>
                        )}
                        <div>
                            <label className="text-[13px] text-white/40 mb-2 block">Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[13px] text-white/40 mb-2 block">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[13px] text-white/40 mb-2 block">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-300 cursor-pointer"
                        >
                            Create Account
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-white/25 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-white/50 hover:text-white underline underline-offset-4 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}