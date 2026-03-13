'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getVehicles, createVehicle, deleteVehicle } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        // AUTH + ROLE CHECK GOES HERE
        // 1. Get the token
        // 2. If no token, redirect to /login
        // 3. Decode the token to check the role (hint: token has 3 parts separated by dots, middle part is base64 JSON)
        // 4. If role !== 'admin', redirect to /vehicles
        // 5. Otherwise, setIsReady(true)
    }, [])

    const { data, isLoading } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => getVehicles(),
        enabled: isReady,
    })

    async function handleDelete(id: number) {
        // DELETE LOGIC GOES HERE
        // 1. Call deleteVehicle(id)
        // 2. Then invalidate the query so the list refreshes:
        //    queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        // CREATE LOGIC GOES HERE
        // 1. Call createVehicle with the form state
        // 2. Invalidate queries to refresh the list
        // 3. Clear the form fields
        // 4. Catch errors and setError
    }

    if (!isReady || isLoading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>

            {/* CREATE FORM */}
            <Card>
                <CardHeader>
                    <CardTitle>Add New Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} />
                            <Input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
                            <Input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
                            <Input type="number" placeholder="Price per day" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />
                            <Input placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                        </div>
                        <Button type="submit">Add Vehicle</Button>
                    </form>
                </CardContent>
            </Card>

            {/* VEHICLE LIST */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Manage Vehicles</h2>
                {data?.data?.map((vehicle: any) => (
                    <Card key={vehicle.id}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                <p className="text-sm">${vehicle.pricePerDay}/day</p>
                            </div>
                            <Button variant="destructive" onClick={() => handleDelete(vehicle.id)}>
                                Delete
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}