'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Map, List, MapPin, Navigation } from 'lucide-react'
import dynamic from 'next/dynamic'
import GradeBadge from '@/components/GradeBadge'
import { MARKETPLACE_PRODUCTS } from '@/lib/mockData'
import type { MarketplaceProduct } from '@/types'

// Dynamically import the map component to avoid SSR issues with Leaflet
const MarketplaceMap = dynamic(() => import('@/components/MarketplaceMap'), {
	ssr: false,
	loading: () => (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--surface2)', borderRadius: '10px' }}>
			<div className="spinner" />
		</div>
	),
})

type ViewMode = 'map' | 'list'

export default function MarketplacePage() {
	const [viewMode, setViewMode] = useState<ViewMode>('map')
	const [search, setSearch] = useState('')
	const [hoveredId, setHoveredId] = useState<number | null>(null)
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

	// Request user location on mount
	useEffect(() => {
		let isMounted = true
		if (typeof navigator !== 'undefined' && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					if (isMounted) setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
				},
				() => {
					// Default to center of India if denied
					if (isMounted) setTimeout(() => setUserLocation({ lat: 20.5937, lng: 78.9629 }), 0)
				}
			)
		} else {
			if (isMounted) setTimeout(() => setUserLocation({ lat: 20.5937, lng: 78.9629 }), 0)
		}
		return () => { isMounted = false }
	}, [])

	const filtered = useMemo(() => {
		if (!search.trim()) return MARKETPLACE_PRODUCTS
		const q = search.toLowerCase()
		return MARKETPLACE_PRODUCTS.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q) ||
				p.city.toLowerCase().includes(q) ||
				p.sku.toLowerCase().includes(q)
		)
	}, [search])

	const gradeCount = useMemo(() => {
		const counts = { B: 0, C: 0, D: 0 }
		filtered.forEach((p) => {
			if (p.grade in counts) counts[p.grade as keyof typeof counts]++
		})
		return counts
	}, [filtered])

	return (
		<div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 98px)' }}>
			{/* Fixed Header & Search Bar */}
			<div style={{ flexShrink: 0, marginBottom: '16px' }}>
				{/* Title row */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
					<div>
						<h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
							Marketplace
						</h1>
						<p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
							Browse returned products available for purchase — Grade B or below
						</p>
					</div>
					<div style={{ display: 'flex', gap: '6px' }}>
						{/* Stats chips */}
						{Object.entries(gradeCount).map(([grade, count]) => (
							<span key={grade} style={{
								padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
								background: grade === 'B' ? 'rgba(0,168,225,0.15)' : grade === 'C' ? 'rgba(255,179,0,0.15)' : 'rgba(255,68,68,0.15)',
								color: grade === 'B' ? '#00a8e1' : grade === 'C' ? '#ffb300' : '#ff4444',
								border: `1px solid ${grade === 'B' ? 'rgba(0,168,225,0.3)' : grade === 'C' ? 'rgba(255,179,0,0.3)' : 'rgba(255,68,68,0.3)'}`,
							}}>
								Grade {grade}: {count}
							</span>
						))}
					</div>
				</div>

				{/* Search + View Toggle */}
				<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
					<div style={{ flex: 1, position: 'relative' }}>
						<Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
						<input
							id="marketplace-search"
							type="text"
							placeholder="Search by product, category, city, or SKU…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{
								width: '100%',
								padding: '10px 14px 10px 36px',
								borderRadius: '8px',
								border: '1px solid var(--border)',
								background: 'var(--surface)',
								color: 'var(--text)',
								fontSize: '13px',
								outline: 'none',
								transition: 'border-color 0.2s',
							}}
							onFocus={(e) => { e.currentTarget.style.borderColor = '#FF9900' }}
							onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
						/>
					</div>
					<div style={{
						display: 'flex', borderRadius: '8px', overflow: 'hidden',
						border: '1px solid var(--border)'
					}}>
						<button
							id="view-map-btn"
							onClick={() => setViewMode('map')}
							style={{
								display: 'flex', alignItems: 'center', gap: '6px',
								padding: '9px 14px', border: 'none', cursor: 'pointer',
								fontSize: '12px', fontWeight: 600,
								background: viewMode === 'map' ? '#FF9900' : 'var(--surface)',
								color: viewMode === 'map' ? '#000' : 'var(--muted)',
								transition: 'all 0.15s',
							}}
						>
							<Map size={14} /> Map
						</button>
						<button
							id="view-list-btn"
							onClick={() => setViewMode('list')}
							style={{
								display: 'flex', alignItems: 'center', gap: '6px',
								padding: '9px 14px', border: 'none', cursor: 'pointer',
								fontSize: '12px', fontWeight: 600,
								background: viewMode === 'list' ? '#FF9900' : 'var(--surface)',
								color: viewMode === 'list' ? '#000' : 'var(--muted)',
								borderLeft: '1px solid var(--border)',
								transition: 'all 0.15s',
							}}
						>
							<List size={14} /> List
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div style={{ flex: 1, minHeight: 0 }}>
				{viewMode === 'map' ? (
					<div style={{ height: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
						<MarketplaceMap
							products={filtered}
							userLocation={userLocation}
							hoveredId={hoveredId}
							onHover={setHoveredId}
						/>
					</div>
				) : (
					<div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
						{filtered.length === 0 ? (
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
								<div style={{ fontSize: '48px', opacity: 0.15 }}>🔍</div>
								<p style={{ fontSize: '13px', color: 'var(--muted)' }}>No products match your search</p>
							</div>
						) : (
							filtered.map((product) => (
								<ListCard
									key={product.id}
									product={product}
									isHovered={hoveredId === product.id}
									onMouseEnter={() => setHoveredId(product.id)}
									onMouseLeave={() => setHoveredId(null)}
								/>
							))
						)}
					</div>
				)}
			</div>

			{/* User location indicator */}
			{userLocation && (
				<div style={{
					position: 'fixed', bottom: '16px', right: '24px',
					padding: '8px 14px', borderRadius: '20px',
					background: 'var(--surface)', border: '1px solid var(--border)',
					fontSize: '11px', color: 'var(--muted)',
					display: 'flex', alignItems: 'center', gap: '6px',
					boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
					zIndex: 1000,
				}}>
					<Navigation size={12} color="#FF9900" />
					Your location: {userLocation.lat.toFixed(2)}°N, {userLocation.lng.toFixed(2)}°E
				</div>
			)}
		</div>
	)
}

function ListCard({ product, isHovered, onMouseEnter, onMouseLeave }: {
	product: MarketplaceProduct
	isHovered: boolean
	onMouseEnter: () => void
	onMouseLeave: () => void
}) {
	return (
		<div
			className="amz-card"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			style={{
				display: 'grid',
				gridTemplateColumns: '60px 1fr auto',
				gap: '16px',
				alignItems: 'center',
				transition: 'all 0.2s ease',
				transform: isHovered ? 'scale(1.01)' : 'scale(1)',
				borderColor: isHovered ? '#FF9900' : 'var(--border)',
				boxShadow: isHovered ? '0 4px 20px rgba(255,153,0,0.15)' : 'none',
				cursor: 'pointer',
			}}
		>
			{/* Emoji */}
			<div style={{
				width: '60px', height: '60px', borderRadius: '10px',
				background: 'var(--surface2)', display: 'flex',
				alignItems: 'center', justifyContent: 'center', fontSize: '28px',
			}}>
				{product.emoji}
			</div>

			{/* Details */}
			<div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
					<span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{product.name}</span>
					<GradeBadge grade={product.grade} />
				</div>
				<div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
					{product.category} · {product.sku}
				</div>
				<div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
					{product.description}
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '11px', color: 'var(--muted)' }}>
					<MapPin size={11} />
					{product.city} · {product.returnReason} · {product.date}
				</div>
			</div>

			{/* Price */}
			<div style={{ textAlign: 'right', minWidth: '100px' }}>
				<div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
					{product.value}
				</div>
				<div style={{ fontSize: '11px', color: 'var(--muted)', textDecoration: 'line-through' }}>
					{product.originalPrice}
				</div>
				<div style={{
					fontSize: '11px', fontWeight: 600, color: '#FF9900', marginTop: '4px',
					padding: '2px 8px', borderRadius: '4px',
					background: 'rgba(255,153,0,0.1)', display: 'inline-block'
				}}>
					{Math.round((1 - parseFloat(product.value.replace(/[₹,]/g, '')) / parseFloat(product.originalPrice.replace(/[₹,]/g, ''))) * 100)}% off
				</div>
			</div>
		</div>
	)
}