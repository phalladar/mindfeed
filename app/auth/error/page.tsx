"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()

  useEffect(() => {
    console.error("Auth error occurred")
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Authentication Error</h1>
      <p className="mt-4">An error occurred during authentication.</p>
      <button
        className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={() => router.push('/')}
      >
        Return Home
      </button>
    </div>
  )
} 