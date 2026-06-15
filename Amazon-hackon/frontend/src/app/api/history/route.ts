import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function GET() {
  // If GEMINI_API_KEY is set (Vercel deployment), return empty history
  // since there's no persistent database on Vercel
  if (GEMINI_API_KEY && !process.env.BACKEND_URL) {
    return NextResponse.json({
      success: true,
      count: 0,
      history: [],
    })
  }

  // Fallback: proxy to Python backend (local development)
  try {
    const response = await fetch(`${BACKEND_URL}/api/history`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { success: false, error: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, history: [], error: `Backend unreachable: ${message}` },
      { status: 502 }
    )
  }
}
