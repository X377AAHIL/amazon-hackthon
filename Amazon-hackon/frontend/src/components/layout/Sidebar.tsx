'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	LayoutDashboard, ScanLine, Route, AlertTriangle,
	ShoppingCart, IdCard, X
} from 'lucide-react'

const MENU_ITEMS = [
	{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ label: 'Inspection', href: '/grading', icon: ScanLine },
	{ label: 'Routing', href: '/routing', icon: Route },
	{ label: 'Fraud Detection', href: '/fraud', icon: AlertTriangle },
	{ label: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
	{ label: 'Lifecycle Card', href: '/lifecycle', icon: IdCard },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname()

	return (
		<>
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
						onClick={onNavigate}
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
		</>
	)
}

/* Desktop Sidebar — always visible on larger screens */
export function DesktopSidebar() {
	return (
		<aside className="sidebar-desktop">
			<NavLinks />
		</aside>
	)
}

/* Mobile Sidebar Drawer — slides in from right */
export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	if (!isOpen) return null

	return (
		<>
			{/* Overlay backdrop */}
			<div className="sidebar-overlay open" onClick={onClose} />

			{/* Drawer */}
			<div className="sidebar-mobile-drawer">
				{/* Close button */}
				<div style={{
					display: 'flex', justifyContent: 'space-between', alignItems: 'center',
					padding: '0 16px 12px', borderBottom: '1px solid #2d3547', marginBottom: '12px'
				}}>
					<span style={{ fontWeight: 700, fontSize: '14px', color: '#FF9900' }}>
						Menu
					</span>
					<button
						onClick={onClose}
						style={{
							background: 'none', border: 'none', color: '#8d9db6',
							cursor: 'pointer', padding: '4px', borderRadius: '4px'
						}}
						aria-label="Close menu"
					>
						<X size={20} />
					</button>
				</div>

				<NavLinks onNavigate={onClose} />
			</div>
		</>
	)
}

/* Default export for backward compat — renders desktop only */
export default function Sidebar() {
	return <DesktopSidebar />
}