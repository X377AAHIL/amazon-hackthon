'use client'

import { AlertTriangle, Ban, Eye, IndianRupee, PieChart, UserX } from 'lucide-react'
import StatCard from '@/components/StatCard'
import { FRAUD_CASES } from '@/lib/mockData'
import type { FraudCase } from '@/types'

export default function FraudPage() {
	return (
		<div className="fade-in">
			<div style={{ marginBottom: '20px' }}>
				<h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
					Fraud Detection
				</h1>
				<p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
					AI-powered return fraud identification and alerting
				</p>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
				<StatCard label="Fraud Cases Today" value="14" icon={AlertTriangle} change="+2 vs yesterday" positive={false} />
				<StatCard label="Attempted Loss" value="₹3.2L" icon={IndianRupee} change="+0.8L vs yesterday" positive={false} />
				<StatCard label="Fraud Rate" value="1.09%" icon={PieChart} change="+0.2% vs yesterday" positive={false} />
			</div>

			{FRAUD_CASES.map((fraudCase: FraudCase) => (
				<div
					key={fraudCase.id}
					className="fade-in"
					style={{
						background: 'rgba(255,68,68,0.08)',
						border: '1px solid rgba(255,68,68,0.3)',
						borderRadius: '10px',
						padding: '20px',
						marginBottom: '16px'
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
						<div style={{
							width: '44px',
							height: '44px',
							background: 'rgba(255,68,68,0.15)',
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							animation: 'pulse 2s infinite'
						}}>
							<AlertTriangle size={22} color="#ff4444" />
						</div>
						<div style={{ flex: 1 }}>
							<div style={{ fontSize: '16px', fontWeight: 700, color: '#ff4444' }}>
								⚠ Return Fraud Detected · {fraudCase.id}
							</div>
							<div style={{ fontSize: '12px', color: 'var(--muted)' }}>
								{fraudCase.date} · Fraud probability: <strong style={{ color: '#ff4444' }}>{fraudCase.fraudProbability}%</strong>
							</div>
						</div>
						<span className="badge badge-fraud">{fraudCase.status}</span>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
						<div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
							<div style={{ width: '80px', height: '80px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--surface)', fontSize: '36px' }}>
								{fraudCase.originalEmoji}
							</div>
							<div style={{ fontSize: '12px', color: 'var(--muted)' }}>Original product ordered</div>
							<div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{fraudCase.originalProduct}</div>
						</div>

						<div style={{ background: 'var(--surface2)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
							<div style={{ width: '80px', height: '80px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,68,68,0.1)', fontSize: '36px' }}>
								{fraudCase.returnedEmoji}
							</div>
							<div style={{ fontSize: '12px', color: 'var(--muted)' }}>Product actually returned</div>
							<div style={{ fontSize: '14px', fontWeight: 700, color: '#ff4444' }}>{fraudCase.returnedProduct}</div>
						</div>
					</div>

					<div>
						<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Fraud confidence</div>
						<div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
							<div style={{ width: `${fraudCase.fraudProbability}%`, height: '100%', borderRadius: '10px', background: 'linear-gradient(90deg, #FFB300, #ff4444)' }} />
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
							<span style={{ color: 'var(--muted)', fontSize: '12px' }}>0%</span>
							<span style={{ color: '#ff4444', fontSize: '12px', fontWeight: 700 }}>{fraudCase.fraudProbability}%</span>
							<span style={{ color: 'var(--muted)', fontSize: '12px' }}>100%</span>
						</div>
					</div>

					<div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
						<button
							className="btn-primary"
							style={{ flex: 1, justifyContent: 'center', background: '#ff4444', color: '#fff' }}
						>
							<Ban size={15} />
							Block Refund
						</button>
						<button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
							<Eye size={15} />
							Investigate
						</button>
						<button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
							<UserX size={15} />
							Flag Account
						</button>
					</div>
				</div>
			))}
		</div>
	)
}