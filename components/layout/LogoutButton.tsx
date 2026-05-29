'use client'

import { logout } from '@/app/dashboard/actions'

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Déconnexion
      </button>
    </form>
  )
}
