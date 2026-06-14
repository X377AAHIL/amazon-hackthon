'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

const NAV_ITEMS = [
	{ label: 'Dashboard', href: '/dashboard' },
	{ label: 'Inspection', href: '/grading' },
	{ label: 'Routing', href: '/routing' },
	{ label: 'Fraud Detection', href: '/fraud' },
	{ label: 'Marketplace', href: '/marketplace' },
	{ label: 'Lifecycle Card', href: '/lifecycle' },
]

export default function Topbar() {
	const pathname = usePathname()

	return (
		<header style={{
			background: '#131921',
			borderBottom: '1px solid #2d3547',
			height: '50px',
			display: 'flex',
			alignItems: 'center',
			padding: '0 20px',
			gap: '16px',
			position: 'sticky',
			top: 0,
			zIndex: 100,
		}}>
			{/* Logo */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<RefreshCw size={18} color="#FF9900" />
				<span style={{ fontWeight: 700, fontSize: '16px', color: '#FF9900', letterSpacing: '-0.5px' }}>
					Intelligent Bridge
				</span>
				<span style={{ fontSize: '11px', color: '#8d9db6', marginLeft: '4px' }}>
					by Coderaki · Amazon Hackathon 2026
				</span>
			</div>

			{/* Nav tabs */}
			<nav style={{ display: 'flex', gap: '2px', marginLeft: '24px', overflowX: 'auto' }}>
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href
					return (
						<Link
							key={item.href}
							href={item.href}
							style={{
								padding: '6px 12px',
								borderRadius: '6px',
								fontSize: '12px',
								fontWeight: isActive ? 600 : 500,
								color: isActive ? '#000' : '#8d9db6',
								background: isActive ? '#FF9900' : 'transparent',
								textDecoration: 'none',
								whiteSpace: 'nowrap',
								transition: 'all 0.15s',
							}}
						>
							{item.label}
						</Link>
					)
				})}
			</nav>

			{/* Live indicator */}
			<div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
				<span style={{
					width: '6px', height: '6px', borderRadius: '50%',
					background: '#00c851', display: 'inline-block',
					animation: 'pulse 1.5s infinite'
				}} />
				<span style={{ fontSize: '11px', color: '#8d9db6' }}>Live</span>
			</div>
		</header>
	)
}