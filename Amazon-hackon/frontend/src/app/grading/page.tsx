'use client'

import { useState, useEffect, useCallback } from 'react'
import { Cpu, RefreshCw, ShieldCheck, ShieldAlert, MapPin, AlertTriangle } from 'lucide-react'
import UploadZone from '@/components/UploadZone'
import GradeBadge from '@/components/GradeBadge'
import ConfidenceBar from '@/components/ConfidenceBar'
import { inspectProduct, getInspectionHistory } from '@/services/api'
import type { Grade, InspectionResponse, HistoryItem } from '@/types'

type Stage = 'upload' | 'ready' | 'analyzing' | 'result'

const RETURN_REASONS = [
	'Changed my mind / Don\'t want it',
	'Box was open, didn\'t like color',
	'Item looks damaged or scuffed',
	'Defective, does not turn on',
	'Incorrect item arrived',
]

export default function InspectionPage() {
	const [stage, setStage] = useState<Stage>('upload')
	const [preview, setPreview] = useState<string | null>(null)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [returnReason, setReturnReason] = useState(RETURN_REASONS[0])
	const [result, setResult] = useState<InspectionResponse | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [history, setHistory] = useState<HistoryItem[]>([])
	const [historyLoading, setHistoryLoading] = useState(true)
	const [backendOnline, setBackendOnline] = useState(true)

	const fetchHistory = useCallback(async () => {
		try {
			setHistoryLoading(true)
			const data = await getInspectionHistory()
			setHistory(data.history || [])
			setBackendOnline(true)
		} catch {
			setHistory([])
			setBackendOnline(false)
		} finally {
			setHistoryLoading(false)
		}
	}, [])

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchHistory()
		}, 0)
		return () => clearTimeout(timer)
	}, [fetchHistory])

	function handleFile(file: File) {
		setPreview(URL.createObjectURL(file))
		setSelectedFile(file)
		setStage('ready')
		setError(null)
	}

	async function handleAnalyze() {
		if (!selectedFile) return

		setStage('analyzing')
		setError(null)

		try {
			const formData = new FormData()
			formData.append('file', selectedFile)
			formData.append('return_reason', returnReason)

			const response = await inspectProduct(formData)
			setResult(response)
			setStage('result')
			// Refresh history after successful grading
			fetchHistory()
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to connect to backend'
			setError(message)
			setStage('ready')
		}
	}

	function handleReset() {
		setStage('upload')
		setPreview(null)
		setSelectedFile(null)
		setResult(null)
		setError(null)
	}

	// Computed summaries from history
	const totalProcessed = history.length
	const fraudCount = history.filter(h => h.is_fraud === 1).length
	const avgConfidence = totalProcessed > 0
		? history.reduce((sum, h) => sum + (h.confidence_score || 0), 0) / totalProcessed
		: 0
	const avgRecovery = totalProcessed > 0
		? history.reduce((sum, h) => sum + (h.value_recovery || 0), 0) / totalProcessed
		: 0

	const data = result?.data

	return (
		<div className="fade-in">
			{/* Header */}
			<div style={{ marginBottom: '20px' }}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div>
						<h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
							Product Inspection
						</h1>
						<p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
							AI-powered grading, fraud detection, and circular routing — powered by Gemini 2.5 Flash
						</p>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<span style={{
							width: '8px', height: '8px', borderRadius: '50%',
							background: backendOnline ? '#00c851' : '#ff4444',
							display: 'inline-block',
							animation: backendOnline ? 'pulse 1.5s infinite' : 'none'
						}} />
						<span style={{ fontSize: '11px', color: 'var(--muted)' }}>
							{backendOnline ? 'Backend Live' : 'Backend Offline'}
						</span>
					</div>
				</div>
			</div>

			{/* Stats bar */}
			<div className="grid-4-cols" style={{ marginBottom: '20px' }}>
				{[
					{ label: 'Processed', value: `${totalProcessed}`, icon: '📦' },
					{ label: 'Fraud Flags', value: `${fraudCount}`, icon: '🚨' },
					{ label: 'Avg Confidence', value: `${(avgConfidence * 100).toFixed(0)}%`, icon: '🎯' },
					{ label: 'Avg Recovery', value: `${avgRecovery.toFixed(0)}%`, icon: '♻️' },
				].map((stat, i) => (
					<div key={i} className="amz-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<span style={{ fontSize: '24px' }}>{stat.icon}</span>
						<div>
							<div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
								{stat.label}
							</div>
							<div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
								{stat.value}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Main grid */}
			<div className="grid-2-cols-uneven" style={{ marginBottom: '20px' }}>
				{/* Left — Intake */}
				<div className="amz-card">
					<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
						📥 Item Intake Center
					</p>

					{/* Return Reason selector */}
					<div style={{ marginBottom: '14px' }}>
						<label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
							Stated Return Reason (from customer)
						</label>
						<select
							id="return-reason-select"
							value={returnReason}
							onChange={(e) => setReturnReason(e.target.value)}
							style={{
								width: '100%',
								padding: '9px 12px',
								borderRadius: '7px',
								border: '1px solid var(--border)',
								background: 'var(--surface2)',
								color: 'var(--text)',
								fontSize: '13px',
								outline: 'none',
								cursor: 'pointer',
							}}
						>
							{RETURN_REASONS.map((reason) => (
								<option key={reason} value={reason}>{reason}</option>
							))}
						</select>
					</div>

					{stage === 'upload' && (
						<UploadZone onFileSelect={handleFile} />
					)}

					{(stage === 'ready' || stage === 'analyzing' || stage === 'result') && (
						<div>
							{/* Image preview */}
							<div style={{
								width: '100%', aspectRatio: '4/3',
								borderRadius: '10px', background: 'var(--surface2)',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								border: '1px solid var(--border)', marginBottom: '12px',
								overflow: 'hidden'
							}}>
								{preview
									? <img src={preview} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
									: <span style={{ fontSize: '40px', opacity: 0.3 }}>📷</span>
								}
							</div>

							{error && (
								<div style={{
									padding: '10px 14px',
									background: 'rgba(255,68,68,0.1)',
									border: '1px solid rgba(255,68,68,0.3)',
									borderRadius: '8px',
									marginBottom: '12px',
									fontSize: '12px',
									color: '#ff6666',
									display: 'flex', alignItems: 'center', gap: '8px'
								}}>
									<AlertTriangle size={14} />
									{error}
								</div>
							)}

							{stage === 'ready' && (
								<button
									className="btn-primary"
									style={{ width: '100%', justifyContent: 'center' }}
									onClick={handleAnalyze}
									disabled={false}
								>
									<Cpu size={15} />
									Run Live Grading
								</button>
							)}

							{stage === 'analyzing' && (
								<div style={{ textAlign: 'center', padding: '16px 0' }}>
									<div className="spinner" style={{ margin: '0 auto 12px' }} />
									<div style={{ fontSize: '13px', color: 'var(--muted)' }}>
										Analyzing item texture, fraud vectors, and routing logic…
									</div>
									<div style={{ fontSize: '11px', color: 'var(--muted)', opacity: 0.6, marginTop: '4px' }}>
										Gemini 2.5 Flash · Computer Vision · Fraud Signal Check
									</div>
								</div>
							)}

							{stage === 'result' && (
								<button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={handleReset}>
									<RefreshCw size={14} />
									Inspect Another
								</button>
							)}
						</div>
					)}

					<div style={{ marginTop: '16px', padding: '10px 12px', background: 'rgba(0,168,225,0.06)', borderRadius: '8px', border: '1px solid rgba(0,168,225,0.15)' }}>
						<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>💡 How it works</div>
						<div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6 }}>
							Upload a return image → AI inspects condition, checks fraud signals, assigns a grade (A–D), and recommends the optimal circular economy route.
						</div>
					</div>
				</div>

				{/* Right — AI Verdict */}
				<div className="amz-card">
					<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
						🔍 Real-Time AI Verdict
					</p>

					{(stage === 'upload' || stage === 'ready') && (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '350px', gap: '12px' }}>
							<div style={{ fontSize: '48px', opacity: 0.15 }}>🔍</div>
							<p style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>
								Upload an image and run live grading to see the AI verdict
							</p>
						</div>
					)}

					{stage === 'analyzing' && (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '350px', gap: '12px' }}>
							<div className="spinner" />
							<p style={{ fontSize: '13px', color: 'var(--muted)' }}>Running inspection…</p>
						</div>
					)}

					{stage === 'result' && data && (
						<div className="fade-in">
							{/* Product header */}
							<div style={{
								display: 'flex', alignItems: 'center', gap: '12px',
								padding: '12px 14px', background: 'var(--surface2)',
								borderRadius: '8px', marginBottom: '16px'
							}}>
								<div style={{ fontSize: '36px' }}>🏷️</div>
								<div>
									<div style={{ fontWeight: 600, fontSize: '15px' }}>{data.product_name}</div>
									<div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
										Category: {data.detected_category}
									</div>
								</div>
							</div>

							{/* Grade + Confidence */}
							<div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '4px 0', marginBottom: '12px' }}>
								{[
									{
										label: 'Condition Grade',
										value: (() => {
											const g = data.grade.replace('Grade ', '').charAt(0).toUpperCase()
											const validGrades = ['A', 'B', 'C', 'D']
											return <GradeBadge grade={(validGrades.includes(g) ? g : 'C') as Grade} />
										})()
									},
									{
										label: 'Confidence Score',
										value: <ConfidenceBar value={Math.round(data.confidence_score * 100)} />
									},
									{
										label: 'Value Recovery',
										value: <span style={{ color: 'var(--green)', fontWeight: 700 }}>{data.estimated_value_recovery_percentage}%</span>
									},
									{
										label: 'Recommended Route',
										value: (
											<span style={{
												display: 'inline-flex', alignItems: 'center', gap: '5px',
												padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
												background: 'rgba(0,168,225,0.15)', color: '#00a8e1'
											}}>
												<MapPin size={11} />
												{data.recommended_route}
											</span>
										)
									},
								].map((row, i) => (
									<div key={i} style={{
										display: 'flex', justifyContent: 'space-between', alignItems: 'center',
										padding: '11px 14px',
										borderBottom: i < 3 ? '1px solid var(--border)' : 'none'
									}}>
										<span style={{ fontSize: '12px', color: 'var(--muted)' }}>{row.label}</span>
										<span>{row.value}</span>
									</div>
								))}
							</div>

							{/* Fraud Check */}
							<div style={{
								padding: '12px 14px',
								background: data.is_fraud_suspected ? 'rgba(255,68,68,0.08)' : 'rgba(0,200,81,0.08)',
								border: `1px solid ${data.is_fraud_suspected ? 'rgba(255,68,68,0.25)' : 'rgba(0,200,81,0.25)'}`,
								borderRadius: '8px',
								marginBottom: '12px',
								display: 'flex', alignItems: 'center', gap: '10px'
							}}>
								{data.is_fraud_suspected
									? <ShieldAlert size={18} color="#ff4444" />
									: <ShieldCheck size={18} color="#00c851" />
								}
								<div>
									<div style={{ fontSize: '12px', fontWeight: 600, color: data.is_fraud_suspected ? '#ff6666' : '#00c851' }}>
										{data.is_fraud_suspected ? '🚨 Fraud Suspected' : '🛡️ Fraud Check Passed'}
									</div>
									<div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
										{data.is_fraud_suspected
											? 'Potential return fraud or item swap detected'
											: 'Item appears consistent with order record'
										}
									</div>
								</div>
							</div>

							{/* Grading Justification */}
							<div style={{
								padding: '12px 14px',
								background: 'rgba(0,168,225,0.07)',
								border: '1px solid rgba(0,168,225,0.2)',
								borderRadius: '8px',
								marginBottom: '12px'
							}}>
								<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
									AI Grading Justification
								</div>
								<div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6 }}>
									{data.grading_justification}
								</div>
							</div>

							{/* Routing Reasoning */}
							<div style={{
								padding: '12px 14px',
								background: 'rgba(160,132,252,0.07)',
								border: '1px solid rgba(160,132,252,0.2)',
								borderRadius: '8px'
							}}>
								<div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
									🗺️ Routing Logic
								</div>
								<div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6 }}>
									{data.routing_reasoning}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* History Ledger */}
			<div className="amz-card">
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
					<p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
						📋 Return Ledger History
					</p>
					<button className="btn-ghost" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={fetchHistory}>
						<RefreshCw size={12} />
						Refresh
					</button>
				</div>

				{historyLoading ? (
					<div style={{ textAlign: 'center', padding: '30px 0' }}>
						<div className="spinner" style={{ margin: '0 auto 12px' }} />
						<div style={{ fontSize: '12px', color: 'var(--muted)' }}>Loading history…</div>
					</div>
				) : history.length === 0 ? (
					<div style={{ textAlign: 'center', padding: '30px 0' }}>
						<div style={{ fontSize: '36px', opacity: 0.2, marginBottom: '8px' }}>📋</div>
						<div style={{ fontSize: '13px', color: 'var(--muted)' }}>
							No inspection records yet. Upload an image to start grading.
						</div>
					</div>
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table className="amz-table">
							<thead>
								<tr>
									<th>Timestamp</th>
									<th>Product</th>
									<th>Category</th>
									<th>Grade</th>
									<th>Confidence</th>
									<th>Fraud</th>
									<th>Route</th>
									<th>Recovery</th>
								</tr>
							</thead>
							<tbody>
								{history.map((item) => {
									const g = item.grade.replace('Grade ', '').charAt(0).toUpperCase()
									const validGrades = ['A', 'B', 'C', 'D']
									return (
										<tr key={item.id}>
											<td style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
												{new Date(item.timestamp).toLocaleString()}
											</td>
											<td style={{ fontWeight: 500, fontSize: '13px' }}>{item.product_name}</td>
											<td style={{ color: 'var(--muted)', fontSize: '12px' }}>{item.category}</td>
											<td>
												<GradeBadge grade={(validGrades.includes(g) ? g : 'C') as Grade} />
											</td>
											<td>
												<ConfidenceBar value={Math.round(item.confidence_score * 100)} />
											</td>
											<td>
												<span style={{
													fontSize: '11px', fontWeight: 600,
													color: item.is_fraud === 1 ? '#ff6666' : '#00c851'
												}}>
													{item.is_fraud === 1 ? '🔴 SUSPECTED' : '🟢 Clean'}
												</span>
											</td>
											<td>
												<span style={{
													display: 'inline-flex', alignItems: 'center', gap: '4px',
													padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
													background: 'rgba(0,168,225,0.15)', color: '#00a8e1'
												}}>
													{item.recommended_route}
												</span>
											</td>
											<td style={{ fontWeight: 600, color: 'var(--green)' }}>
												{item.value_recovery}%
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}