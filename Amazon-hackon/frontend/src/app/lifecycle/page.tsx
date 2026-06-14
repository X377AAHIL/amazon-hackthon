'use client'

import {
	Award,
	Bot,
	CheckCircle,
	Clock,
	IndianRupee,
	Leaf,
	QrCode,
	Recycle,
	ShieldCheck,
} from 'lucide-react'
import { TIMELINE_EVENTS } from '@/lib/mockData'
import type { TimelineEvent } from '@/types'

export default function LifecyclePage() {
	return (
		<div className="fade-in">
			<div style={{ marginBottom: '20px' }}>
				<h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
					Product Lifecycle Card
				</h1>
				<p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
					Digital passport for every returned and refurbished item
				</p>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
				<div className="amz-card">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
						<div>
							<div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
								Digital Product Passport
							</div>
							<div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
								Sony WH-1000XM5
							</div>
							<div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
								Second life · May 2026
							</div>
						</div>

						<div style={{ width: '80px', height: '80px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
								<QrCode size={28} style={{ display: 'block', marginBottom: '2px' }} />
								<div style={{ fontSize: '9px', color: 'var(--muted)' }}>Scan to verify</div>
							</div>
						</div>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }}>
						<div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
							<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Grade</div>
							<div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--amz-blue)' }}>B</div>
						</div>
						<div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
							<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Condition</div>
							<div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green)' }}>Like New</div>
						</div>
						<div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
							<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Waste Saved</div>
							<div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--purple)' }}>1.2 kg</div>
						</div>
					</div>

					<div style={{ position: 'relative', paddingLeft: '24px' }}>
						<div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--amz-orange), var(--green))' }} />

						{TIMELINE_EVENTS.map((event: TimelineEvent) => (
							<div key={`${event.date}-${event.event}`} style={{ position: 'relative', marginBottom: '20px' }}>
								<div style={{ position: 'absolute', left: '-20px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--amz-orange)', background: event.done ? 'var(--amz-orange)' : 'var(--surface)' }} />
								<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>{event.date}</div>
								<div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{event.event}</div>
								<div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{event.detail}</div>
							</div>
						))}
					</div>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
					<div className="amz-card">
						<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
							Sustainability Impact
						</p>

						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<Leaf size={16} color="var(--green)" />
								<span style={{ fontSize: '13px', color: 'var(--muted)' }}>CO₂ prevented</span>
							</div>
							<div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green)' }}>1.2 kg</div>
						</div>

						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<Recycle size={16} color="var(--green)" />
								<span style={{ fontSize: '13px', color: 'var(--muted)' }}>Landfill space saved</span>
							</div>
							<div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green)' }}>0.8 L</div>
						</div>

						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<IndianRupee size={16} color="var(--amz-blue)" />
								<span style={{ fontSize: '13px', color: 'var(--muted)' }}>Value recovered</span>
							</div>
							<div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--amz-blue)' }}>₹13,800</div>
						</div>

						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<Clock size={16} color="var(--amber)" />
								<span style={{ fontSize: '13px', color: 'var(--muted)' }}>Time to resell</span>
							</div>
							<div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--amber)' }}>4 days</div>
						</div>
					</div>

					<div className="amz-card">
						<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
							Certification
						</p>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'var(--surface2)', borderRadius: '7px', border: '1px solid var(--border)' }}>
								<Bot size={16} color="var(--amz-blue)" />
								<span style={{ fontSize: '13px', color: 'var(--text)' }}>AI Inspection verified</span>
								<CheckCircle size={14} color="var(--green)" style={{ marginLeft: 'auto' }} />
							</div>

							<div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'var(--surface2)', borderRadius: '7px', border: '1px solid var(--border)' }}>
								<ShieldCheck size={16} color="var(--green)" />
								<span style={{ fontSize: '13px', color: 'var(--text)' }}>Fraud screening passed</span>
								<CheckCircle size={14} color="var(--green)" style={{ marginLeft: 'auto' }} />
							</div>

							<div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'var(--surface2)', borderRadius: '7px', border: '1px solid var(--border)' }}>
								<Leaf size={16} color="var(--green)" />
								<span style={{ fontSize: '13px', color: 'var(--text)' }}>Amazon Climate Pledge</span>
								<CheckCircle size={14} color="var(--green)" style={{ marginLeft: 'auto' }} />
							</div>

							<div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'var(--surface2)', borderRadius: '7px', border: '1px solid var(--border)' }}>
								<Award size={16} color="var(--amber)" />
								<span style={{ fontSize: '13px', color: 'var(--text)' }}>Condition independently verified</span>
								<CheckCircle size={14} color="var(--green)" style={{ marginLeft: 'auto' }} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}