import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const backendForm = new FormData()

    const file = formData.get('file') as File | null
    if (file) {
      backendForm.append('file', file, file.name)
    }

    const returnReason = formData.get('return_reason') as string | null
    if (returnReason) {
      backendForm.append('return_reason', returnReason)
    }

    const response = await fetch(`${BACKEND_URL}/api/grade`, {
      method: 'POST',
      body: backendForm,
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
      { success: false, error: `Backend unreachable: ${message}` },
      { status: 502 }
    )
  }
}