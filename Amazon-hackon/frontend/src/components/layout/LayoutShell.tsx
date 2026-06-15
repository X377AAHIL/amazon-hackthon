'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { DesktopSidebar, MobileSidebar } from '@/components/layout/Sidebar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
			<div style={{ display: 'flex', flex: 1 }}>
				<DesktopSidebar />
				<main className="main-content">
					{children}
				</main>
			</div>
			<MobileSidebar
				isOpen={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
			/>
		</div>
	)
}
