'use client'

import { useState } from 'react'
import {
	BarChart, Bar, PieChart, Pie, Cell,
	XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
	RefreshCw, Package, BadgeDollarSign, Leaf, TrendingUp
} from 'lucide-react'
import StatCard from '@/components/StatCard'
import GradeBadge from '@/components/GradeBadge'
import RouteBadge from '@/components/RouteBadge'
import ConfidenceBar from '@/components/ConfidenceBar'
import { PRODUCTS, WEEKLY_DATA, ROUTE_DISTRIBUTION } from '@/lib/mockData'

export default function DashboardPage() {
	const [search, setSearch] = useState('')

	const filtered = PRODUCTS.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase()) ||
		p.category.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className="fade-in">
			{/* Header */}
			<div style={{ marginBottom: '20px' }}>
				<h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
					Intelligent Bridge
				</h1>
				<p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
					<span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00c851', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
					Live · Jun 13, 2026 · Amazon Reverse Logistics Platform
				</p>
			</div>

			{/* Stat Cards */}
			<div className="grid-4-cols" style={{ marginBottom: '20px' }}>
				<StatCard label="Total Returns Today" value="1,284" icon={RefreshCw} change="+8.2% vs yesterday" positive={false} />
				<StatCard label="Products Recovered" value="892" icon={Package} change="+12.4% vs yesterday" positive={true} />
				<StatCard label="Revenue Saved" value="₹45.2L" icon={BadgeDollarSign} change="+18.7% vs yesterday" positive={true} />
				<StatCard label="Landfill Reduction" value="72%" icon={Leaf} change="+5.1% vs yesterday" positive={true} />
			</div>

			{/* Charts */}
			<div className="grid-2-cols" style={{ marginBottom: '20px' }}>
				{/* Bar Chart */}
				<div className="amz-card">
					<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
						Returns vs Recovered — This Week
					</p>
					<ResponsiveContainer width="100%" height={180}>
						<BarChart data={WEEKLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#2d3547" />
							<XAxis dataKey="day" tick={{ fill: '#8d9db6', fontSize: 11 }} />
							<YAxis tick={{ fill: '#8d9db6', fontSize: 11 }} />
							<Tooltip
								contentStyle={{
									background: '#1a1f2e', border: '1px solid #2d3547',
									borderRadius: '8px', fontSize: '12px'
								}}
							/>
							<Bar dataKey="returns" fill="#FF9900" opacity={0.6} radius={[4, 4, 0, 0]} />
							<Bar dataKey="recovered" fill="#00c851" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Pie Chart */}
				<div className="amz-card">
					<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
						Routing Distribution
					</p>
					<ResponsiveContainer width="100%" height={130}>
						<PieChart>
							<Pie
								data={ROUTE_DISTRIBUTION}
								cx="50%" cy="50%"
								innerRadius={40} outerRadius={60}
								dataKey="value" paddingAngle={3}
							>
								{ROUTE_DISTRIBUTION.map((entry, i) => (
									<Cell key={i} fill={entry.color} />
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									background: '#1a1f2e', border: '1px solid #2d3547',
									borderRadius: '8px', fontSize: '12px'
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: '4px' }}>
						{ROUTE_DISTRIBUTION.map((r, i) => (
							<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
								<span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, display: 'inline-block' }} />
								<span style={{ color: '#8d9db6' }}>{r.name}</span>
								<span style={{ fontWeight: 600, color: '#e7e9ec' }}>{r.value}%</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Returns Table */}
			<div className="amz-card">
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
					<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
						Recent Returns Queue
					</p>
					<div style={{ display: 'flex', gap: '8px' }}>
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search products…"
							style={{
								background: 'var(--surface2)', border: '1px solid var(--border)',
								borderRadius: '7px', padding: '7px 12px', fontSize: '13px',
								color: 'var(--text)', outline: 'none', width: '100%', maxWidth: '220px', minWidth: '140px'
							}}
						/>
					</div>
				</div>

				<div style={{ overflowX: 'auto' }}>
					<table className="amz-table">
						<thead>
							<tr>
								<th>Product</th>
								<th>Category</th>
								<th>Grade</th>
								<th>Confidence</th>
								<th>Routing</th>
								<th>Value</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((p) => (
								<tr key={p.id}>
									<td>
										<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
											<div style={{
												width: '36px', height: '36px', borderRadius: '6px',
												background: 'var(--surface2)', display: 'flex',
												alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0
											}}>
												{p.emoji}
											</div>
											<div>
												<div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text)' }}>{p.name}</div>
												<div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.sku}</div>
											</div>
										</div>
									</td>
									<td style={{ color: 'var(--muted)', fontSize: '12px' }}>{p.category}</td>
									<td><GradeBadge grade={p.grade} /></td>
									<td><ConfidenceBar value={p.confidence} /></td>
									<td><RouteBadge route={p.route} /></td>
									<td style={{ fontWeight: 600, color: p.value === '—' ? 'var(--red)' : 'var(--text)' }}>{p.value}</td>
									<td style={{ color: 'var(--muted)', fontSize: '12px' }}>{p.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}