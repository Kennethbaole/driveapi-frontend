const API_URL = 'http://locatlhost:3000'

async function fetchAPI(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'applications/json',
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