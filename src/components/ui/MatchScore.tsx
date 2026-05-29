import { COLORS } from '@/constants/colors'

type MatchScoreProps = {
  score: number
  size?: 'sm' | 'md'
}

function getColor(score: number) {
  if (score >= 85) return COLORS.match.high
  if (score >= 70) return COLORS.match.medium
  return COLORS.match.low
}

export default function MatchScore({ score, size = 'md' }: MatchScoreProps) {
  const color = getColor(score)
  const isSmall = size === 'sm'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span
        className={`rounded-full ${isSmall ? 'h-1.5 w-1.5' : 'h-2 w-2'}`}
        style={{ backgroundColor: color }}
      />
      {score}% match
    </span>
  )
}
