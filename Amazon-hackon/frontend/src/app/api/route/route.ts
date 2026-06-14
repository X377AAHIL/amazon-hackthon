import { NextResponse } from 'next/server'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(_req: Request) {
  await delay(800)

  return NextResponse.json({
    options: [
      { name: 'Amazon Warehouse', matchPercent: 87, description: 'Best match based on condition and demand' },
      { name: 'Amazon Renewed', matchPercent: 71, description: 'Eligible after minor refurbishment' },
      { name: 'Amazon Outlet', matchPercent: 55, description: 'Discounted sale on outlet store' },
      { name: 'Liquidation Partner', matchPercent: 38, description: 'Bulk resale to liquidation warehouse' },
    ],
    recoveryValue: '₹14,500',
    co2Prevented: '1.2 kg',
  })
}