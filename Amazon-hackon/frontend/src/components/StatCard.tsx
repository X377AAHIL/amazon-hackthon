import { LucideIcon } from 'lucide-react'

interface StatCardProps {
	label: string
	value: string | number
	icon: LucideIcon
	change: string
	positive: boolean
}

export default function StatCard({ label, value, icon: Icon, change, positive }: StatCardProps) {
	return (
		<div className="amz-card">
			<div style={{
				fontSize: '11px', color: 'var(--muted)', fontWeight: 500,
				textTransform: 'uppercase', letterSpacing: '0.06em',
				marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px'
			}}>
				<Icon size={13} />
				{label}
			</div>
			<div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
				{value}
			</div>
			<div style={{
				fontSize: '11px', marginTop: '6px',
				color: positive ? 'var(--green)' : 'var(--red)',
				display: 'flex', alignItems: 'center', gap: '4px'
			}}>
				{positive ? '↑' : '↓'} {change}
			</div>
		</div>
	)
}