import { Product, DashboardStats, FraudCase, Buyer, TimelineEvent, RouteOption, MarketplaceProduct } from '@/types'

export const PRODUCTS: Product[] = [
	{ id: 1, emoji: '🎧', name: 'Sony WH-1000XM5', sku: 'B0BXYXY69T', category: 'Electronics', grade: 'B', confidence: 87, route: 'Amazon Warehouse', value: '₹14,500', returnReason: 'Wrong item', date: 'Jun 12' },
	{ id: 2, emoji: '👟', name: 'Nike Air Max 270', sku: 'AH8050-100', category: 'Footwear', grade: 'A', confidence: 95, route: 'Amazon Renewed', value: '₹8,200', returnReason: 'Size issue', date: 'Jun 12' },
	{ id: 3, emoji: '📱', name: 'iPhone 14 Pro', sku: 'MQ0E3LL/A', category: 'Electronics', grade: 'FRAUD', confidence: 94, route: 'Flagged', value: '—', returnReason: 'Return fraud', date: 'Jun 12' },
	{ id: 4, emoji: '🍳', name: 'Instant Pot Duo 7-in-1', sku: 'IP-DUO60', category: 'Kitchen', grade: 'C', confidence: 72, route: 'Liquidation', value: '₹2,100', returnReason: 'Defective', date: 'Jun 11' },
	{ id: 5, emoji: '🧱', name: 'LEGO Creator 42161', sku: '6431827', category: 'Toys', grade: 'A', confidence: 98, route: 'Amazon Renewed', value: '₹5,800', returnReason: 'Changed mind', date: 'Jun 11' },
	{ id: 6, emoji: '⌨️', name: 'Keychron K2 Pro', sku: 'K2P-A1', category: 'Electronics', grade: 'B', confidence: 81, route: 'Amazon Warehouse', value: '₹9,000', returnReason: 'Bought wrong version', date: 'Jun 11' },
	{ id: 7, emoji: '⌚', name: 'Fossil Gen 6 Watch', sku: 'FTW7069', category: 'Accessories', grade: 'D', confidence: 63, route: 'Recycle', value: '₹400', returnReason: 'Damaged in transit', date: 'Jun 10' },
	{ id: 8, emoji: '💡', name: 'Philips Hue Starter Kit', sku: '562877', category: 'Smart Home', grade: 'A', confidence: 91, route: 'Amazon Renewed', value: '₹4,500', returnReason: 'Duplicate order', date: 'Jun 10' },
]

export const DASHBOARD_STATS: DashboardStats = {
	totalReturns: 1284,
	productsRecovered: 892,
	revenueSaved: '₹45.2L',
	landfillReduction: '72%',
}

export const WEEKLY_DATA = [
	{ day: 'Mon', returns: 198, recovered: 142 },
	{ day: 'Tue', returns: 224, recovered: 167 },
	{ day: 'Wed', returns: 187, recovered: 141 },
	{ day: 'Thu', returns: 256, recovered: 198 },
	{ day: 'Fri', returns: 312, recovered: 244 },
	{ day: 'Sat', returns: 285, recovered: 220 },
	{ day: 'Sun', returns: 284, recovered: 221 },
]

export const ROUTE_DISTRIBUTION = [
	{ name: 'Resell', value: 55, color: '#00a8e1' },
	{ name: 'Refurbish', value: 20, color: '#00c851' },
	{ name: 'Donate', value: 15, color: '#a084fc' },
	{ name: 'Recycle', value: 10, color: '#7ec87e' },
]

export const FRAUD_CASES: FraudCase[] = [
	{ id: 'FR-4821', originalProduct: 'Apple AirPods Pro', originalEmoji: '🎧', returnedProduct: 'Generic Earbuds', returnedEmoji: '🎵', fraudProbability: 94, status: 'Flagged', date: 'Jun 12' },
	{ id: 'FR-4819', originalProduct: 'iPhone 14 Pro', originalEmoji: '📱', returnedProduct: 'Non-Apple Smartphone', returnedEmoji: '📲', fraudProbability: 88, status: 'Flagged', date: 'Jun 12' },
	{ id: 'FR-4815', originalProduct: 'Ray-Ban Aviators', originalEmoji: '🕶️', returnedProduct: 'Replica Sunglasses', returnedEmoji: '🕶️', fraudProbability: 79, status: 'Under Review', date: 'Jun 11' },
]

export const BUYERS: Buyer[] = [
	{ name: 'Ravi M.', location: 'Hyderabad', offer: '₹13,800', matchScore: 96 },
	{ name: 'Priya S.', location: 'Bangalore', offer: '₹13,500', matchScore: 91 },
	{ name: 'Arjun K.', location: 'Chennai', offer: '₹12,900', matchScore: 87 },
	{ name: 'Neha T.', location: 'Mumbai', offer: '₹12,500', matchScore: 82 },
]

export const TIMELINE_EVENTS: TimelineEvent[] = [
	{ date: 'May 10, 09:14', event: 'Customer return initiated', detail: 'Reason: Wrong size · Order #114-2938821', done: true },
	{ date: 'May 10, 14:30', event: 'Arrived at fulfillment center', detail: 'FC-BLR2 · Bengaluru', done: true },
	{ date: 'May 10, 14:31', event: 'AI inspection completed', detail: 'Grade B · 87% confidence · 0.8 seconds', done: true },
	{ date: 'May 11, 10:00', event: 'Routed to refurbishment', detail: 'Minor scratch polish · packaging replacement', done: true },
	{ date: 'May 11, 16:00', event: 'Re-listed on Amazon Warehouse', detail: '₹14,500 · Condition: Like New', done: true },
	{ date: 'May 14, 13:22', event: 'Sold to new buyer', detail: 'Ravi M. · Hyderabad · ₹13,800', done: true },
	{ date: 'May 14, 13:22', event: 'Life cycle complete', detail: 'Item diverted from landfill · 1.2 kg CO₂ saved', done: true },
]

export const ROUTE_OPTIONS: RouteOption[] = [
	{ name: 'Amazon Warehouse', icon: 'Building2', matchPercent: 87, description: 'Best match based on condition and demand', color: '#00a8e1' },
	{ name: 'Amazon Renewed', icon: 'RefreshCw', matchPercent: 71, description: 'Eligible after minor refurbishment', color: '#00c851' },
	{ name: 'Amazon Outlet', icon: 'Tag', matchPercent: 55, description: 'Discounted sale on outlet store', color: '#FFB300' },
	{ name: 'Liquidation', icon: 'Package', matchPercent: 38, description: 'Bulk resale to liquidation warehouse', color: '#a084fc' },
]

// Marketplace products — Grade B or below (slightly damaged items for resale)
export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
	{ id: 101, emoji: '🎧', name: 'Sony WH-1000XM5', sku: 'B0BXYXY69T', category: 'Electronics', grade: 'B', confidence: 87, value: '₹14,500', originalPrice: '₹19,990', returnReason: 'Minor scratches on earcup', date: 'Jun 12', city: 'Hyderabad', lat: 17.385, lng: 78.4867, description: 'Light cosmetic wear on left earcup. Noise cancellation fully functional. All original accessories included.' },
	{ id: 102, emoji: '⌨️', name: 'Keychron K2 Pro', sku: 'K2P-A1', category: 'Electronics', grade: 'B', confidence: 81, value: '₹9,000', originalPrice: '₹12,500', returnReason: 'Bought wrong version', date: 'Jun 11', city: 'Bengaluru', lat: 12.9716, lng: 77.5946, description: 'Opened box, keys tested. Minor fingerprint marks on keycaps. Fully working with Bluetooth and wired modes.' },
	{ id: 103, emoji: '🍳', name: 'Instant Pot Duo 7-in-1', sku: 'IP-DUO60', category: 'Kitchen', grade: 'C', confidence: 72, value: '₹2,100', originalPrice: '₹6,499', returnReason: 'Dent on outer shell', date: 'Jun 11', city: 'Mumbai', lat: 19.076, lng: 72.8777, description: 'Small cosmetic dent on outer housing. All pressure cooking functions verified working. Seal ring intact.' },
	{ id: 104, emoji: '⌚', name: 'Fossil Gen 6 Watch', sku: 'FTW7069', category: 'Accessories', grade: 'D', confidence: 63, value: '₹400', originalPrice: '₹24,995', returnReason: 'Screen cracked', date: 'Jun 10', city: 'Delhi', lat: 28.6139, lng: 77.209, description: 'Display has hairline crack. Touch still responsive. Bluetooth and heart rate sensor working. Band in good condition.' },
	{ id: 105, emoji: '📱', name: 'Samsung Galaxy S23', sku: 'SM-S911B', category: 'Electronics', grade: 'B', confidence: 89, value: '₹42,000', originalPrice: '₹59,999', returnReason: 'Changed mind', date: 'Jun 12', city: 'Chennai', lat: 13.0827, lng: 80.2707, description: 'Opened but barely used. Tiny scuff on corner. Battery health 100%. Comes with original charger and box.' },
	{ id: 106, emoji: '🖥️', name: 'Dell UltraSharp U2723QE', sku: 'U2723QE', category: 'Electronics', grade: 'B', confidence: 85, value: '₹38,500', originalPrice: '₹52,000', returnReason: 'One dead pixel noticed', date: 'Jun 10', city: 'Pune', lat: 18.5204, lng: 73.8567, description: 'Single dead pixel in top-right corner. 4K IPS panel otherwise flawless. Stand and cables included.' },
	{ id: 107, emoji: '🎮', name: 'PS5 DualSense Controller', sku: 'CFI-ZCT1G', category: 'Gaming', grade: 'C', confidence: 74, value: '₹3,200', originalPrice: '₹5,990', returnReason: 'Stick drift issue', date: 'Jun 11', city: 'Kolkata', lat: 22.5726, lng: 88.3639, description: 'Left analog stick shows slight drift. Haptic feedback and adaptive triggers fully functional. Can be calibrated.' },
	{ id: 108, emoji: '👟', name: 'Adidas Ultraboost 22', sku: 'GX5460', category: 'Footwear', grade: 'B', confidence: 90, value: '₹8,500', originalPrice: '₹14,999', returnReason: 'Color different from photos', date: 'Jun 12', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, description: 'Tried on once indoors. Sole pristine, no wear marks. Original box and tags present.' },
	{ id: 109, emoji: '🔊', name: 'JBL Charge 5', sku: 'JBLCHARGE5BLK', category: 'Electronics', grade: 'B', confidence: 83, value: '₹10,500', originalPrice: '₹14,999', returnReason: 'Scuff on bottom', date: 'Jun 11', city: 'Jaipur', lat: 26.9124, lng: 75.7873, description: 'Light scuff mark on rubber base. Sound quality perfect. IP67 waterproofing intact. 20-hour battery verified.' },
	{ id: 110, emoji: '💻', name: 'Logitech MX Master 3S', sku: 'MXMASTER3S', category: 'Electronics', grade: 'C', confidence: 70, value: '₹5,500', originalPrice: '₹9,995', returnReason: 'Scroll wheel noisy', date: 'Jun 10', city: 'Lucknow', lat: 26.8467, lng: 80.9462, description: 'Electromagnetic scroll wheel makes subtle clicking noise. All buttons and sensor working perfectly. USB-C cable included.' },
	{ id: 111, emoji: '🎒', name: 'American Tourister Backpack', sku: 'AT-BP-32L', category: 'Accessories', grade: 'B', confidence: 88, value: '₹1,800', originalPrice: '₹3,299', returnReason: 'Zipper slightly stiff', date: 'Jun 12', city: 'Kochi', lat: 9.9312, lng: 76.2673, description: 'Main compartment zipper needs slight force. Laptop sleeve and all pockets intact. No tears or stains.' },
	{ id: 112, emoji: '📷', name: 'GoPro Hero 11', sku: 'CHDHX-111', category: 'Electronics', grade: 'B', confidence: 86, value: '₹28,000', originalPrice: '₹40,490', returnReason: 'Lens cover scratched', date: 'Jun 11', city: 'Goa', lat: 15.4909, lng: 73.8278, description: 'Protective lens cover has micro-scratches (replaceable). Camera and sensor pristine. All mounts included.' },
]