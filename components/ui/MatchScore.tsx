type Props = { score: number }

export function MatchScore({ score }: Props) {
  const color =
    score >= 85 ? '#22C55E' :
    score >= 70 ? '#F59E0B' :
                  '#EF4444'

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>
        {score}%
      </span>
    </div>
  )
}
