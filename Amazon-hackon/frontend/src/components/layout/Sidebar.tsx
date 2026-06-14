'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	LayoutDashboard, ScanLine, Route, AlertTriangle,
	ShoppingCart, IdCard, Settings, FileBarChart
} from 'lucide-react'

const MENU_ITEMS = [
	{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ label: 'Inspection', href: '/grading', icon: ScanLine },
	{ label: 'Routing', href: '/routing', icon: Route },
	{ label: 'Fraud Detection', href: '/fraud', icon: AlertTriangle },
	{ label: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
	{ label: 'Lifecycle Card', href: '/lifecycle', icon: IdCard },
]

const SYSTEM_ITEMS = [
	{ label: 'Settings', href: '#', icon: Settings },
	{ label: 'Reports', href: '#', icon: FileBarChart },
]

export default function Sidebar() {
	const pathname = usePathname()

	return (
		<aside style={{
			width: '200px',
			background: '#232F3E',
			borderRight: '1px solid #2d3547',
			padding: '16px 0',
			flexShrink: 0,
			minHeight: '100vh',
		}}>
			<p style={{
				fontSize: '10px', fontWeight: 600, color: '#8d9db6',
				letterSpacing: '0.08em', textTransform: 'uppercase',
				padding: '0 16px', marginBottom: '6px'
			}}>
				Navigation
			</p>

			{MENU_ITEMS.map((item) => {
				const isActive = pathname === item.href
				const Icon = item.icon
				return (
					<Link
						key={item.href}
						href={item.href}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
							padding: '9px 16px',
							fontSize: '13px',
							color: isActive ? '#FF9900' : '#8d9db6',
							background: isActive ? 'rgba(255,153,0,0.08)' : 'transparent',
							borderLeft: isActive ? '3px solid #FF9900' : '3px solid transparent',
							textDecoration: 'none',
							transition: 'all 0.15s',
						}}
					>
						<Icon size={15} />
						{item.label}
					</Link>
				)
			})}

			<p style={{
				fontSize: '10px', fontWeight: 600, color: '#8d9db6',
				letterSpacing: '0.08em', textTransform: 'uppercase',
				padding: '16px 16px 6px', marginTop: '8px'
			}}>
				System
			</p>

			{SYSTEM_ITEMS.map((item) => {
				const Icon = item.icon
				return (
					<Link
						key={item.label}
						href={item.href}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
							padding: '9px 16px',
							fontSize: '13px',
							color: '#8d9db6',
							textDecoration: 'none',
							borderLeft: '3px solid transparent',
							transition: 'all 0.15s',
						}}
					>
						<Icon size={15} />
						{item.label}
					</Link>
				)
			})}
		</aside>
	)
}