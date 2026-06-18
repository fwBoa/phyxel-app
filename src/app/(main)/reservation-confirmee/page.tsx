import Link  from 'next/link'

export default function ReservationConfirmeePage() {
  return (
    <div className="flex flex-col items-center py-16 px-4">

      {/* Vidéo */}
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-72 w-full object-cover"
        >
          <source src="/assets/video/Phyxel-opt.webm" type="video/webm" />
          <source src="/assets/video/Phyxel-opt.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Message */}
      <div className="mt-12 flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold" style={{ color: '#1A844F' }}>
          Votre demande a bien été envoyée
        </h1>
        <p className="max-w-md text-text-secondary">
          Le propriétaire dispose de 48h pour répondre. Vous recevrez une notification
          dès qu&apos;une réponse est disponible.
        </p>

        <div className="mt-4 flex gap-3">
          <Link
            href="/dashboard/reservations"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Voir mes demandes
          </Link>
          <Link
            href="/explorer"
            className="rounded-full border border-border-custom px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-50"
          >
            Continuer à explorer
          </Link>
        </div>
      </div>

    </div>
  )
}
