'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAccessToken, clearTokens } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    const router = useRouter()
    const token = getAccessToken()

    function handleLogout() {
        clearTokens()
        router.push('/login')
    }

    return (
        <nav className="flex items-center justify-between p-4 border-b">
            <div className="flex gap-4">
                <Link href="/vehicles">Vehicles</Link>
                {token && <Link href="/bookings">Bookings</Link>}
            </div>
            <div className="flex gap-4">
                {token ? (
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}