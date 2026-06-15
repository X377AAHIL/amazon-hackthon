import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

const GRADING_SCHEMA = {
  type: 'object' as const,
  properties: {
    product_name: { type: 'string' as const, description: 'Identified or clean name of the product.' },
    detected_category: { type: 'string' as const, description: 'Product category, e.g., Electronics, Apparel, Home.' },
    grade: { type: 'string' as const, description: 'Must be strictly one of: Grade A, Grade B, Grade C, Grade D.' },
    confidence_score: { type: 'number' as const, description: 'Confidence score between 0.00 and 1.00 for the grading logic.' },
    is_fraud_suspected: { type: 'boolean' as const, description: 'True if the item appears to be a fraudulent swap or completely missing its parts.' },
    grading_justification: { type: 'string' as const, description: 'A concise sentence explaining why this grade was assigned based on visual cues.' },
    recommended_route: { type: 'string' as const, description: 'Strictly one of: Amazon Warehouse, Amazon Renewed, Liquidation, Recycle.' },
    estimated_value_recovery_percentage: { type: 'number' as const, description: 'Estimated resale value recovery from 0 to 100 based on condition and route.' },
    routing_reasoning: { type: 'string' as const, description: 'Brief explanation of why this specific route saves costs or prevents landfill waste.' },
  },
  required: [
    'product_name', 'detected_category', 'grade', 'confidence_score',
    'is_fraud_suspected', 'grading_justification', 'recommended_route',
    'estimated_value_recovery_percentage', 'routing_reasoning',
  ],
}

async function gradeWithGemini(imageBytes: Uint8Array, mimeType: string, returnReason: string) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! })

  const systemInstruction =
    'You are an expert automated warehouse inspector for Amazon. ' +
    'Your task is to review the image of a returned item, assess its condition against ' +
    'the stated reason for return, run a fraud check, and calculate the smartest downstream routing ' +
    'to optimize financial recovery and minimize carbon footprint.'

  const prompt = `
    Analyze this returned item.
    Stated Return Reason from Customer: "${returnReason}"

    Perform these checks:
    1. Inspect visually for scuffs, open packaging, or missing pieces. Assign Grade A, B, C, or D.
    2. Check if the item matches typical merchant descriptions or if a fraud item swap happened.
    3. Determine the optimal downstream target destination based on the grade.
  `

  const base64Data = Buffer.from(imageBytes).toString('base64')

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: GRADING_SCHEMA,
      temperature: 0.2,
    },
  })

  const text = response.text ?? ''
  return JSON.parse(text)
}

async function gradeViaBackend(formData: FormData) {
  const backendForm = new FormData()

  const file = formData.get('file') as File | null
  if (file) backendForm.append('file', file, file.name)

  const returnReason = formData.get('return_reason') as string | null
  if (returnReason) backendForm.append('return_reason', returnReason)

  const response = await fetch(`${BACKEND_URL}/api/grade`, {
    method: 'POST',
    body: backendForm,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return response.json()
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // If we have a Gemini API key, call Gemini directly (Vercel deployment)
    if (GEMINI_API_KEY) {
      const file = formData.get('file') as File | null
      const returnReason = (formData.get('return_reason') as string) || 'Item broken or unwanted'

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file uploaded' },
          { status: 400 }
        )
      }

      const arrayBuffer = await file.arrayBuffer()
      const imageBytes = new Uint8Array(arrayBuffer)
      const mimeType = file.type || 'image/jpeg'

      const aiResult = await gradeWithGemini(imageBytes, mimeType, returnReason)

      return NextResponse.json({
        success: true,
        image_url: '',
        data: aiResult,
      })
    }

    // Fallback: proxy to Python backend (local development)
    const data = await gradeViaBackend(formData)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Grading failed: ${message}` },
      { status: 502 }
    )
  }
}