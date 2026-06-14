import { Grade } from '@/types'

export default function GradeBadge({ grade }: { grade: Grade }) {
	if (grade === 'FRAUD') {
		return (
			<span className="badge badge-fraud">
				⚠ FRAUD
			</span>
		)
	}

	const cls = {
		A: 'badge-a',
		B: 'badge-b',
		C: 'badge-c',
		D: 'badge-d',
	}[grade]

	return (
		<span className={`badge ${cls}`}>
			Grade {grade}
		</span>
	)
}