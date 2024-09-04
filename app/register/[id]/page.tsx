'use client'

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const events = [
  { id: 1, name: 'Tech Conference', date: '2024-09-15' },
  { id: 2, name: 'Music Festival', date: '2024-09-01' },
  { id: 3, name: 'Art Exhibition', date: '2024-09-15' },
];

export default function RegisterPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isSignedIn, isLoaded, user } = useUser()
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const event = events.find((e) => e.id === parseInt(params.id))

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!event) {
    return <div>Event not found</div>
  }

  const handleRegister = async () => {
    if (!isSignedIn) {
      setError('Please sign in to register for events')
      return
    }

    setIsRegistering(true)
    setError(null)

    try {
      // Simulate API call to register for the event
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(`You have successfully registered for ${event.name}`)
      router.push('/client')
    } catch (err) {
      setError('An error occurred while registering. Please try again.')
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register for Event</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
        <p className="text-gray-600 mb-4">Date: {event.date}</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isRegistering ? 'Registering...' : 'Confirm Registration'}
        </button>
      </div>
    </div>
  )
};