'use client'

import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  deleteAction: () => Promise<void>
}

export default function DeleteButton({ deleteAction }: DeleteButtonProps) {
  return (
    <form action={deleteAction}>
      <button
        type="submit"
        className="rounded-lg p-2 text-text-secondary hover:bg-match-low/10 hover:text-match-low transition-colors"
        title="Supprimer"
        onClick={(e) => {
          if (!confirm('Supprimer cet espace ? Cette action est irréversible.')) {
            e.preventDefault()
          }
        }}
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}
