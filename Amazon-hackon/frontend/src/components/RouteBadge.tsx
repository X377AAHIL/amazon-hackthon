import { RouteType } from '@/types'

export default function RouteBadge({ route }: { route: RouteType }) {
	const cls: Record<RouteType, string> = {
		'Amazon Warehouse': 'tag-warehouse',
		'Amazon Renewed': 'tag-renewed',
		'Amazon Outlet': 'tag-liquidate',
		'Liquidation': 'tag-liquidate',
		'Donate': 'tag-donate',
		'Recycle': 'tag-recycle',
		'Flagged': 'tag-flagged',
	}

	return (
		<span className={`tag ${cls[route]}`}>
			{route}
		</span>
	)
}