'use client'

import { Trash2 } from 'lucide-react'
import { deleteSpaceAction } from './actions'

interface DeleteButtonProps {
  spaceId: string
}

export default function DeleteButton({ spaceId }: DeleteButtonProps) {
  return (
    <form
      action={async () => {
        if (!confirm('Supprimer cet espace ? Cette action est irréversible.')) return
        await deleteSpaceAction(spaceId)
      }}
    >
      <button
        type="submit"
        className="rounded-lg p-2 text-text-secondary hover:bg-match-low/10 hover:text-match-low transition-colors"
        title="Supprimer"
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}
