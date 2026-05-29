import { signup } from './actions'
import Link from 'next/link'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const error = params.error
  const success = params.success

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-hero text-primary-foreground text-sm font-bold shadow-card">P</span>
            <span className="text-foreground">Phyxel</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Créer un compte</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Rejoignez Phyxel pour trouver votre lieu idéal.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
            {success}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1">Nom complet</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Marie Dupont"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="vous@marque.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-muted-foreground">Minimum 6 caractères</p>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">Vous êtes</label>
            <select
              id="role"
              name="role"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="brand">Une marque (je cherche un lieu)</option>
              <option value="host">Un hôte (je propose un lieu)</option>
            </select>
          </div>
          <button
            formAction={signup}
            className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Déjà inscrit ?{' '}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
