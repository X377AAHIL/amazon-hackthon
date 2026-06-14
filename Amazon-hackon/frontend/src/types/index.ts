export type Grade = 'A' | 'B' | 'C' | 'D' | 'FRAUD'

export type RouteType =
	| 'Amazon Warehouse'
	| 'Amazon Renewed'
	| 'Amazon Outlet'
	| 'Liquidation'
	| 'Donate'
	| 'Recycle'
	| 'Flagged'

export interface Product {
	id: number
	emoji: string
	name: string
	sku: string
	category: string
	grade: Grade
	confidence: number
	route: RouteType
	value: string
	returnReason: string
	date: string
}

export interface DashboardStats {
	totalReturns: number
	productsRecovered: number
	revenueSaved: string
	landfillReduction: string
}

export interface RouteOption {
	name: RouteType
	icon: string
	matchPercent: number
	description: string
	color: string
}

export interface FraudCase {
	id: string
	originalProduct: string
	originalEmoji: string
	returnedProduct: string
	returnedEmoji: string
	fraudProbability: number
	status: 'Flagged' | 'Under Review' | 'Confirmed'
	date: string
}

export interface Buyer {
	name: string
	location: string
	offer: string
	matchScore: number
}

export interface TimelineEvent {
	date: string
	event: string
	detail: string
	done: boolean
}

export interface InspectionResult {
	product_name: string
	detected_category: string
	grade: string
	confidence_score: number
	is_fraud_suspected: boolean
	grading_justification: string
	recommended_route: string
	estimated_value_recovery_percentage: number
	routing_reasoning: string
}

export interface InspectionResponse {
	success: boolean
	image_url: string
	data: InspectionResult
}

export interface HistoryItem {
	id: number
	product_name: string
	category: string
	grade: string
	confidence_score: number
	is_fraud: number
	grading_justification: string
	recommended_route: string
	value_recovery: number
	routing_reasoning: string
	image_path: string
	timestamp: string
}

export interface MarketplaceProduct {
	id: number
	emoji: string
	name: string
	sku: string
	category: string
	grade: Grade
	confidence: number
	value: string
	originalPrice: string
	returnReason: string
	date: string
	city: string
	lat: number
	lng: number
	description: string
}