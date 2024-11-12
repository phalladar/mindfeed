import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    return await auth(request)
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    return await auth(request)
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 