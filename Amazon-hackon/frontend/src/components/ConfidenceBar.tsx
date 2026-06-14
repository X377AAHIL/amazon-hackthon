export default function ConfidenceBar({ value }: { value: number }) {
	const color = value > 85 ? '#00c851' : value > 70 ? '#FFB300' : '#ff4444'

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
			<div style={{
				width: '80px', height: '5px',
				background: 'var(--border)', borderRadius: '10px', overflow: 'hidden'
			}}>
				<div style={{
					width: `${value}%`, height: '100%',
					borderRadius: '10px', background: color,
					transition: 'width 0.6s ease'
				}} />
			</div>
			<span style={{ fontSize: '12px', color: 'var(--muted)' }}>{value}%</span>
		</div>
	)
}