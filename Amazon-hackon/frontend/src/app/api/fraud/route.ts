import { NextResponse } from 'next/server'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(_req: Request) {
  await delay(1200)

  return NextResponse.json({
    fraudDetected: true,
    fraudProbability: 94,
    originalProduct: 'Apple AirPods Pro',
    returnedProduct: 'Generic Earbuds',
    caseId: 'FR-4821',
  })
}