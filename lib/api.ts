
import { getAccessToken } from './auth'
const API_URL = 'http://localhost:3001'

async function fetchAPI(endpoint: string, options?: RequestInit) {
    const token = getAccessToken()
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
        },
        ...options,
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Something went wrong')
    }

    return res.json()
}

export async function getVehicles(params?: string) {
    return fetchAPI(`/vehicles${params ? `?${params}` : ''}`)
}

export async function getVehicle(id: number) {
    return fetchAPI(`/vehicles/${id}`)
}

export async function login(email: string, password: string) {
    return fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })
}

export async function signup(email: string, password: string, name: string) {
    return fetchAPI('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
    })
}

export async function getBookings(params?: string) {
    return fetchAPI(`/bookings${params ? `?${params}` : ''}`)
}

export async function createBooking(vehicleId: number, startDate: string, endDate:string) {
    return fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({ vehicleId, startDate, endDate }),
    })
}

