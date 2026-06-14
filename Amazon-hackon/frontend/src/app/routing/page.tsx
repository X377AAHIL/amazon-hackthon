'use client'

import { useState, useMemo, useEffect } from 'react'
import {
	ArrowLeftRight, Cpu, Award, Building2, RefreshCw, Tag, Package,
	Check, Edit3, UserCheck, Truck, MapPin, AlertTriangle, Recycle, ShieldAlert, Camera
} from 'lucide-react'
import GradeBadge from '@/components/GradeBadge'
import { PRODUCTS } from '@/lib/mockData'

export default function RoutingPage() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [selected, setSelected] = useState(0)
	const [isApproving, setIsApproving] = useState(false)
	const [approvedIds, setApprovedIds] = useState<number[]>([])

	const product = PRODUCTS[currentIndex]
	const isAllCaughtUp = approvedIds.length === PRODUCTS.length

	// Determine Route Options based on grade
	const routeOptions = useMemo(() => {
		if (!product) return []
		
		if (product.grade === 'FRAUD') {
			return [
				{ name: 'Security Investigation', icon: ShieldAlert, matchPercent: 99, description: 'Quarantine item for fraud review team.', color: '#ff4444' },
				{ name: 'Return to Sender', icon: Truck, matchPercent: 12, description: 'Send back to customer, deny refund.', color: '#8d9db6' },
			]
		} else if (product.grade === 'D') {
			return [
				{ name: 'Recycle Partner', icon: Recycle, matchPercent: 94, description: 'E-Waste recycling facility (R2 certified)', color: '#00c851' },
				{ name: 'Liquidation Partner', icon: Package, matchPercent: 42, description: 'Bulk resale for parts', color: '#a084fc' },
			]
		} else if (product.grade === 'C') {
			return [
				{ name: 'Amazon Outlet', icon: Tag, matchPercent: 88, description: 'Discounted sale on outlet store', color: '#FFB300' },
				{ name: 'Liquidation Partner', icon: Package, matchPercent: 65, description: 'Bulk resale to liquidation warehouse', color: '#a084fc' },
			]
		} else {
			// Grades A & B
			return [
				{ name: 'Direct to Local Buyer', icon: UserCheck, matchPercent: 96, description: 'Same-state buyer match. Route via local courier.', color: '#a084fc' },
				{ name: 'Amazon Renewed', icon: RefreshCw, matchPercent: 87, description: 'Eligible after minor refurbishment', color: '#00c851' },
				{ name: 'Amazon Warehouse', icon: Building2, matchPercent: 71, description: 'Return to central fulfillment center', color: '#00a8e1' },
			]
		}
	}, [product])

	// Reset selected route to 0 when product changes
	useEffect(() => {
		setSelected(0)
	}, [product])

	const flowSteps = useMemo(() => {
		if (!product) return []
		const selectedRoute = routeOptions[selected] || routeOptions[0]
		
		const baseSteps = [
			{ label: 'Returned', sub: `${product.date}, 14:30`, color: '#FF9900', icon: ArrowLeftRight },
			{ label: 'Inspected by AI', sub: `${product.date}, 14:31 · 0.8s`, color: '#00a8e1', icon: Cpu },
			{ label: `Grade ${product.grade} Assigned`, sub: `${product.confidence}% confidence`, color: product.grade === 'FRAUD' ? '#ff4444' : '#00a8e1', icon: Award },
		]

		if (selectedRoute.name === 'Direct to Local Buyer') {
			return [
				...baseSteps,
				{ label: 'Local Buyer Matched', sub: 'Same State', color: '#a084fc', icon: MapPin },
				{ label: 'Local Courier Repack', sub: 'Nearest Hub', color: '#00c851', icon: Package },
				{ label: 'Dispatched to Buyer', sub: 'Est. Delivery Tomorrow', color: '#00c851', icon: Truck },
			]
		} else if (selectedRoute.name === 'Security Investigation') {
			return [
				...baseSteps,
				{ label: 'Fraud Flag Triggered', sub: 'Mismatch detected', color: '#ff4444', icon: AlertTriangle },
				{ label: 'Security Quarantine', sub: 'Awaiting manual review', color: '#ff4444', icon: ShieldAlert },
			]
		} else if (selectedRoute.name === 'Recycle Partner') {
			return [
				...baseSteps,
				{ label: 'E-Waste Bin Assigned', sub: 'Bin #402', color: '#00c851', icon: Recycle },
				{ label: 'Dispatched to Recycler', sub: 'GreenCycle Corp.', color: '#00c851', icon: Truck },
			]
		} else if (selectedRoute.name === 'Amazon Renewed') {
			return [
				...baseSteps,
				{ label: 'Amazon Renewed Facility', sub: 'Sent for Refurbishment', color: '#00c851', icon: RefreshCw },
			]
		} else if (selectedRoute.name === 'Amazon Outlet') {
			return [
				...baseSteps,
				{ label: 'Amazon Outlet', sub: 'Listed for discounted sale', color: '#FFB300', icon: Tag },
			]
		} else if (selectedRoute.name === 'Amazon Warehouse') {
			return [
				...baseSteps,
				{ label: 'Amazon Warehouse', sub: 'Return to central FC', color: '#00c851', icon: Building2 },
			]
		} else {
			return [
				...baseSteps,
				{ label: 'Liquidation Transit', sub: 'Bulk transit prepared', color: '#8d9db6', icon: Package },
			]
		}
	}, [product, selected, routeOptions])

	const handleApprove = () => {
		if (!product) return
		setIsApproving(true)
		setTimeout(() => {
			setIsApproving(false)
			const newApproved = [...approvedIds, product.id]
			setApprovedIds(newApproved)
			
			// Find next unapproved
			const nextIndex = PRODUCTS.findIndex(p => !newApproved.includes(p.id))
			if (nextIndex !== -1) {
				setCurrentIndex(nextIndex)
			}
		}, 600)
	}

	const selectedRoute = routeOptions[selected] || routeOptions[0]

	return (
		<div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			{/* Header */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
				<div>
					<h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
						Smart Routing Center
					</h1>
					<p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
						AI-powered destination assignment after grading
					</p>
				</div>
				<div style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--surface2)', padding: '6px 12px', borderRadius: '20px' }}>
					Pending: {PRODUCTS.length - approvedIds.length} / {PRODUCTS.length}
				</div>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: '16px', alignItems: 'start', flex: 1, minHeight: 0 }}>
				
				{/* Column 1: Queue Sidebar */}
				<div className="amz-card" style={{ height: '100%', overflowY: 'auto', padding: '16px 12px' }}>
					<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
						Routing Queue
					</p>
					
					{isAllCaughtUp ? (
						<div style={{ textAlign: 'center', padding: '40px 10px' }}>
							<div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,200,81,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
								<Check size={20} color="var(--green)" />
							</div>
							<div style={{ fontSize: '13px', fontWeight: 600 }}>All Caught Up</div>
							<div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>Queue is empty</div>
							<button className="btn-ghost" onClick={() => { setApprovedIds([]); setCurrentIndex(0); }} style={{ marginTop: '16px', padding: '6px 12px', fontSize: '11px', width: '100%', justifyContent: 'center' }}>
								Reset Demo
							</button>
						</div>
					) : (
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							{PRODUCTS.map((p, i) => {
								const isApproved = approvedIds.includes(p.id)
								const isActive = currentIndex === i && !isAllCaughtUp
								
								return (
									<div 
										key={p.id}
										onClick={() => setCurrentIndex(i)}
										style={{
											padding: '10px',
											borderRadius: '8px',
											background: isActive ? 'rgba(255,153,0,0.08)' : 'var(--surface2)',
											border: isActive ? '1px solid rgba(255,153,0,0.5)' : '1px solid transparent',
											cursor: 'pointer',
											display: 'flex',
											gap: '10px',
											alignItems: 'center',
											opacity: isApproved ? 0.4 : 1,
											transition: 'all 0.2s',
										}}
									>
										<div style={{ width: '32px', height: '32px', background: 'var(--surface)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
											{isApproved ? <Check size={16} color="var(--green)" /> : p.emoji}
										</div>
										<div style={{ overflow: 'hidden' }}>
											<div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', textDecoration: isApproved ? 'line-through' : 'none' }}>
												{p.name}
											</div>
											<div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
												<GradeBadge grade={p.grade as "A" | "B" | "C" | "D" | "FRAUD"} />
												<span style={{ fontSize: '10px', color: 'var(--muted)' }}>{p.sku.slice(0, 6)}</span>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>

				{isAllCaughtUp ? (
					<div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
						<div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,200,81,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Check size={32} color="var(--green)" />
						</div>
						<h2 style={{ fontSize: '20px', fontWeight: 600 }}>Queue Empty</h2>
						<p style={{ color: 'var(--muted)' }}>All returned products have been successfully routed.</p>
					</div>
				) : (
					<>
						{/* Approval overlay area over the right two columns */}
						<div style={{ position: 'relative', display: 'contents' }}>
							{isApproving && (
								<div style={{
									position: 'absolute', inset: 0, zIndex: 10,
									background: 'rgba(26, 31, 46, 0.7)', backdropFilter: 'blur(4px)',
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									borderRadius: '12px', gridColumn: 'span 2'
								}}>
									<div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
										<div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '0 8px 32px rgba(0,200,81,0.4)' }}>
											<Check size={32} />
										</div>
										<div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>Route Approved</div>
									</div>
								</div>
							)}

							{/* Column 2: Product + Flow */}
							<div className="amz-card" style={{ height: '100%', overflowY: 'auto' }}>
								<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
									Product Details
								</p>

								<div style={{
									display: 'flex', gap: '14px', alignItems: 'center',
									padding: '14px', background: 'var(--surface2)', borderRadius: '8px', marginBottom: '20px'
								}}>
									<div style={{ fontSize: '40px' }}>{product?.emoji}</div>
									<div>
										<div style={{ fontWeight: 600, fontSize: '15px' }}>{product?.name}</div>
										<div style={{ fontSize: '12px', color: 'var(--muted)', margin: '2px 0' }}>{product?.sku} · {product?.category}</div>
										<div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
											<GradeBadge grade={product?.grade as "A" | "B" | "C" | "D" | "FRAUD"} />
											<span style={{ fontSize: '11px', color: 'var(--muted)' }}>{product?.confidence}% confidence</span>
										</div>
										<button className="btn-ghost" style={{ marginTop: '12px', padding: '4px 8px', fontSize: '11px', color: 'var(--amz-orange)', border: '1px solid rgba(255,153,0,0.3)', background: 'rgba(255,153,0,0.05)' }}>
											<Camera size={12} />
											View Inspection Photos
										</button>
									</div>
								</div>

								<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
									Routing Flow
								</p>

								<div>
									{flowSteps.map((step, i) => {
										const Icon = step.icon
										return (
											<div key={i} className="fade-in">
												<div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
													<div style={{
														width: '32px', height: '32px', borderRadius: '50%',
														display: 'flex', alignItems: 'center', justifyContent: 'center',
														background: `${step.color}22`, border: `2px solid ${step.color}`, flexShrink: 0,
														boxShadow: i >= 3 ? `0 0 12px ${step.color}40` : 'none',
													}}>
														<Icon size={14} color={step.color} />
													</div>
													<div>
														<div style={{ fontSize: '13px', fontWeight: 500 }}>{step.label}</div>
														<div style={{ fontSize: '11px', color: 'var(--muted)' }}>{step.sub}</div>
													</div>
												</div>
												{i < flowSteps.length - 1 && (
													<div style={{ width: '2px', height: '24px', background: 'var(--border)', marginLeft: '15px' }} />
												)}
											</div>
										)
									})}
								</div>
							</div>

							{/* Column 3: Route Options */}
							<div className="amz-card" style={{ height: '100%', overflowY: 'auto' }}>
								<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
									AI Route Recommendations
								</p>

								{routeOptions.map((route, i) => {
									const Icon = route.icon
									const isSelected = selected === i
									return (
										<div
											key={i}
											onClick={() => setSelected(i)}
											style={{
												display: 'flex', alignItems: 'center', justifyContent: 'space-between',
												padding: '12px 14px', background: 'var(--surface2)', borderRadius: '8px',
												border: isSelected ? `1px solid ${route.color}` : '1px solid var(--border)',
												marginBottom: '8px', cursor: 'pointer', transition: 'all 0.15s'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
												<div style={{
													width: '34px', height: '34px', borderRadius: '8px',
													background: `${route.color}18`, display: 'flex',
													alignItems: 'center', justifyContent: 'center'
												}}>
													<Icon size={16} color={route.color} />
												</div>
												<div>
													<div style={{ fontSize: '13px', fontWeight: 500, color: isSelected ? route.color : 'inherit' }}>{route.name}</div>
													<div style={{ fontSize: '11px', color: 'var(--muted)' }}>{route.description}</div>
												</div>
											</div>
											<div style={{ textAlign: 'right' }}>
												<div style={{ fontSize: '14px', fontWeight: 700, color: route.color }}>{route.matchPercent}%</div>
												<div style={{ fontSize: '10px', color: 'var(--muted)' }}>match</div>
											</div>
										</div>
									)
								})}

								{/* Recovery summary */}
								{product && product.grade !== 'FRAUD' && (
									<div className="fade-in" style={{
										marginTop: '16px', padding: '12px 14px',
										background: selectedRoute?.color + '15', 
										border: `1px solid ${selectedRoute?.color}40`,
										borderRadius: '8px',
										transition: 'all 0.2s'
									}}>
										<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
											<span style={{ fontSize: '12px', color: 'var(--muted)' }}>Recovery value at selected route</span>
											<span style={{ fontSize: '14px', fontWeight: 700, color: selectedRoute?.color }}>{product.value}</span>
										</div>
										<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
											<span style={{ fontSize: '12px', color: 'var(--muted)' }}>Logistics saved</span>
											<span style={{ fontSize: '14px', fontWeight: 700, color: selectedRoute?.color }}>
												{selectedRoute?.name === 'Direct to Local Buyer' ? '100% (Direct)' : '0%'}
											</span>
										</div>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<span style={{ fontSize: '12px', color: 'var(--muted)' }}>CO₂ emissions prevented</span>
											<span style={{ fontSize: '14px', fontWeight: 700, color: selectedRoute?.color }}>
												{selectedRoute?.name === 'Direct to Local Buyer' ? '3.8 kg' : '1.2 kg'}
											</span>
										</div>
									</div>
								)}
								
								{product && product.grade === 'FRAUD' && (
									<div className="fade-in" style={{
										marginTop: '16px', padding: '12px 14px',
										background: 'rgba(255, 68, 68, 0.07)', 
										border: '1px solid rgba(255, 68, 68, 0.2)',
										borderRadius: '8px'
									}}>
										<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4444' }}>
											<ShieldAlert size={18} />
											<span style={{ fontSize: '13px', fontWeight: 600 }}>High Fraud Probability</span>
										</div>
										<p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
											This item has been flagged by the visual inspection AI. Proceed with caution and route to security.
										</p>
									</div>
								)}

								{/* Actions */}
								<div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
									<button 
										onClick={handleApprove}
										disabled={isApproving}
										className="btn-primary" 
										style={{ 
											flex: 1, justifyContent: 'center', 
											background: selectedRoute?.color, 
											color: ['#FFB300'].includes(selectedRoute?.color || '') ? '#000' : '#fff',
											border: 'none',
											opacity: isApproving ? 0.7 : 1
										}}
									>
										<Check size={15} />
										{isApproving ? 'Approving...' : 'Approve Route'}
									</button>
									<button className="btn-ghost" style={{ justifyContent: 'center' }}>
										<Edit3 size={14} />
										Override
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}