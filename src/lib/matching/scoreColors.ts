export function getMatchColor(score: number): string {
  if (score >= 85) return 'var(--color-match-high)'
  if (score >= 70) return 'var(--color-match-medium)'
  return 'var(--color-match-low)'
}
