import { NextResponse } from 'next/server'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function GET() {
  await delay(2000)

  return NextResponse.json({
    totalMatches: 23,
    topBuyers: [
      { name: 'Ravi M.', location: 'Hyderabad', offer: '₹13,800', matchScore: 96 },
      { name: 'Priya S.', location: 'Bangalore', offer: '₹13,500', matchScore: 91 },
      { name: 'Arjun K.', location: 'Chennai', offer: '₹12,900', matchScore: 87 },
      { name: 'Neha T.', location: 'Mumbai', offer: '₹12,500', matchScore: 82 },
    ],
  })
}