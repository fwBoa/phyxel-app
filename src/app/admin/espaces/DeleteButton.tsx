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
        className="rounded-lg p-2 text-[#6B6B6B] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors"
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
