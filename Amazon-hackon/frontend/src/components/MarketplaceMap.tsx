'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MarketplaceProduct } from '@/types'

interface MarketplaceMapProps {
	products: MarketplaceProduct[]
	userLocation: { lat: number; lng: number } | null
	hoveredId: number | null
	onHover: (id: number | null) => void
}

const GRADE_COLORS: Record<string, string> = {
	B: '#00a8e1',
	C: '#ffb300',
	D: '#ff4444',
}

function createProductIcon(product: MarketplaceProduct) {
	const color = GRADE_COLORS[product.grade] || '#8d9db6'

	return L.divIcon({
		className: 'marketplace-marker',
		html: `<div class="marker-content" style="
			width: 36px;
			height: 36px;
			border-radius: 50%;
			background: #1a1f2e;
			border: 2px solid ${color};
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.3);
			transition: all 0.2s ease;
			cursor: pointer;
			position: relative;
		">${product.emoji}</div>`,
		iconSize: [36, 36],
		iconAnchor: [18, 18],
		popupAnchor: [0, -18],
	})
}

function createUserIcon() {
	return L.divIcon({
		className: 'user-marker',
		html: `<div style="
			width: 18px;
			height: 18px;
			border-radius: 50%;
			background: #FF9900;
			border: 3px solid #fff;
			box-shadow: 0 0 0 3px rgba(255,153,0,0.3), 0 2px 8px rgba(0,0,0,0.3);
			animation: pulse 1.5s infinite;
			pointer-events: none;
		"></div>`,
		iconSize: [18, 18],
		iconAnchor: [9, 9],
	})
}

function buildPopupContent(product: MarketplaceProduct): string {
	const gradeColor = GRADE_COLORS[product.grade] || '#8d9db6'
	const discount = Math.round(
		(1 - parseFloat(product.value.replace(/[₹,]/g, '')) / parseFloat(product.originalPrice.replace(/[₹,]/g, ''))) * 100
	)

	return `
		<div style="
			min-width: 260px;
			max-width: 300px;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			color: #e7e9ec;
		">
			<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
				<div style="
					width: 44px; height: 44px; border-radius: 8px;
					background: #222839; display: flex; align-items: center;
					justify-content: center; font-size: 22px; flex-shrink: 0;
				">${product.emoji}</div>
				<div>
					<div style="font-weight: 700; font-size: 14px; line-height: 1.2;">${product.name}</div>
					<div style="font-size: 11px; color: #8d9db6; margin-top: 2px;">${product.category} · ${product.sku}</div>
				</div>
			</div>

			<div style="
				display: flex; justify-content: space-between; align-items: center;
				padding: 8px 10px; background: #222839; border-radius: 6px; margin-bottom: 8px;
			">
				<div>
					<span style="
						display: inline-block; padding: 2px 8px; border-radius: 12px;
						font-size: 11px; font-weight: 600;
						background: ${gradeColor}22; color: ${gradeColor};
						border: 1px solid ${gradeColor}44;
					">Grade ${product.grade}</span>
				</div>
				<div style="text-align: right;">
					<div style="font-size: 16px; font-weight: 700; color: #00c851;">${product.value}</div>
					<div style="font-size: 10px; color: #8d9db6; text-decoration: line-through;">${product.originalPrice}</div>
				</div>
			</div>

			<div style="font-size: 11px; color: #8d9db6; line-height: 1.6; margin-bottom: 8px;">
				${product.description}
			</div>

			<div style="
				display: flex; justify-content: space-between; align-items: center;
				font-size: 11px; color: #8d9db6;
			">
				<span>📍 ${product.city} · ${product.date}</span>
				<span style="
					padding: 2px 8px; border-radius: 4px;
					background: rgba(255,153,0,0.15); color: #FF9900;
					font-weight: 600;
				">${discount}% off</span>
			</div>
		</div>
	`
}

export default function MarketplaceMap({ products, userLocation, hoveredId, onHover }: MarketplaceMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<L.Map | null>(null)
	const markersRef = useRef<Map<number, L.Marker>>(new Map())
	const userMarkerRef = useRef<L.Marker | null>(null)

	// Initialize the map
	useEffect(() => {
		if (!mapRef.current || mapInstanceRef.current) return

		const map = L.map(mapRef.current, {
			center: [20.5937, 78.9629], // Center of India
			zoom: 5,
			zoomControl: true,
			attributionControl: true,
		})

		// Dark theme map tiles
		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
			maxZoom: 19,
		}).addTo(map)

		// Custom popup styling
		const style = document.createElement('style')
		style.textContent = `
			.leaflet-popup-content-wrapper {
				background: #1a1f2e !important;
				border: 1px solid #2d3547 !important;
				border-radius: 12px !important;
				box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important;
				padding: 0 !important;
			}
			.leaflet-popup-content {
				margin: 14px !important;
				color: #e7e9ec !important;
			}
			.leaflet-popup-tip {
				background: #1a1f2e !important;
				border: 1px solid #2d3547 !important;
			}
			.leaflet-popup-close-button {
				color: #8d9db6 !important;
				font-size: 18px !important;
				top: 8px !important;
				right: 10px !important;
			}
			.leaflet-popup-close-button:hover {
				color: #FF9900 !important;
			}
			.marketplace-marker {
				background: none !important;
				border: none !important;
			}
			.marketplace-marker.hovered .marker-content,
			.marketplace-marker:hover .marker-content {
				transform: scale(1.44);
				box-shadow: 0 6px 24px rgba(0,0,0,0.5) !important;
				border-width: 3px !important;
				z-index: 999;
			}
			.user-marker {
				background: none !important;
				border: none !important;
				pointer-events: none !important;
			}
		`
		document.head.appendChild(style)

		mapInstanceRef.current = map

		return () => {
			map.remove()
			mapInstanceRef.current = null
			style.remove()
		}
	}, [])

	// Add/update user location marker
	useEffect(() => {
		const map = mapInstanceRef.current
		if (!map || !userLocation) return

		if (userMarkerRef.current) {
			userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
		} else {
			const marker = L.marker([userLocation.lat, userLocation.lng], {
				icon: createUserIcon(),
				zIndexOffset: -100, // Put user marker below products so it doesn't block hover
				interactive: false, // Disable interaction
			}).addTo(map)
			userMarkerRef.current = marker
		}
	}, [userLocation])

	// Add/update product markers
	useEffect(() => {
		const map = mapInstanceRef.current
		if (!map) return

		// Remove old markers
		markersRef.current.forEach((marker) => marker.remove())
		markersRef.current.clear()

		products.forEach((product) => {
			const marker = L.marker([product.lat, product.lng], {
				icon: createProductIcon(product),
			}).addTo(map)

			marker.bindPopup(buildPopupContent(product), {
				maxWidth: 320,
				closeButton: true,
			})

			marker.on('mouseover', () => {
				onHover(product.id)
			})

			marker.on('mouseout', () => {
				onHover(null)
			})

			marker.on('click', () => {
				marker.openPopup()
			})

			markersRef.current.set(product.id, marker)
		})

		// Fit bounds if we have products
		if (products.length > 0) {
			const bounds = L.latLngBounds(products.map((p) => [p.lat, p.lng]))
			if (userLocation) {
				bounds.extend([userLocation.lat, userLocation.lng])
			}
			map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 })
		}
	}, [products, userLocation])

	// Update hovered marker icon
	useEffect(() => {
		const map = mapInstanceRef.current
		if (!map) return

		markersRef.current.forEach((marker, id) => {
			const el = marker.getElement()
			if (!el) return
			const isHovered = hoveredId === id
			if (isHovered) {
				el.classList.add('hovered')
				marker.setZIndexOffset(999)
				marker.openPopup()
			} else {
				el.classList.remove('hovered')
				marker.setZIndexOffset(0)
				marker.closePopup()
			}
		})
	}, [hoveredId])

	return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
