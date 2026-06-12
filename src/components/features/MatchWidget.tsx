import { Check, AlertCircle } from 'lucide-react'

type MatchWidgetProps = {
  score: number
  brandName?: string | null
  pointsForts: string[]
  pointsVigilance: string[]
}

export default function MatchWidget({ score, brandName, pointsForts, pointsVigilance }: MatchWidgetProps) {
  // If score is 0 and no points, optionally hide it, but let's show it anyway based on the design
  
  return (
    <div className="rounded-2xl border border-border-custom p-6 shadow-sm bg-white flex flex-col gap-5">
      
      {/* En-tête */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold">
          {score}%
        </div>
        <div>
          <h3 className="font-bold text-foreground text-[15px]">Pourquoi ce lieu matche</h3>
          <p className="text-sm text-text-secondary">
            avec votre marque {brandName ? <span className="font-semibold text-foreground">{brandName}</span> : ''}
          </p>
        </div>
      </div>

      {/* Points forts */}
      {pointsForts.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-[11px] font-bold tracking-wider text-primary uppercase">POINTS FORTS</h4>
          <ul className="flex flex-col gap-2">
            {pointsForts.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Check size={16} className="mt-0.5 shrink-0 text-foreground" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Points de vigilance */}
      {pointsVigilance.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-[11px] font-bold tracking-wider text-orange-500 uppercase mt-2">POINTS DE VIGILANCE</h4>
          <ul className="flex flex-col gap-2">
            {pointsVigilance.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-text-secondary" />
                <span><span className="text-orange-500 mr-1">!</span> {point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
