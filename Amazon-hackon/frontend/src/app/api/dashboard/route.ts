import { NextResponse } from 'next/server'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function GET() {
  await delay(500)

  return NextResponse.json({
    stats: {
      totalReturns: 1284,
      productsRecovered: 892,
      revenueSaved: '₹45.2L',
      landfillReduction: '72%',
    },
    weeklyData: [
      { day: 'Mon', returns: 198, recovered: 142 },
      { day: 'Tue', returns: 224, recovered: 167 },
      { day: 'Wed', returns: 187, recovered: 141 },
      { day: 'Thu', returns: 256, recovered: 198 },
      { day: 'Fri', returns: 312, recovered: 244 },
      { day: 'Sat', returns: 285, recovered: 220 },
      { day: 'Sun', returns: 284, recovered: 221 },
    ],
  })
}