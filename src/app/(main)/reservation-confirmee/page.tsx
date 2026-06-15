import Image from 'next/image'
import Link  from 'next/link'

const IMAGES = [
  '/assets/img/image-1.jpg',
  '/assets/img/image-2.jpg',
  '/assets/img/image-3.jpg',
  '/assets/img/image-4.jpg',
  '/assets/img/image-5.jpg',
]

export default function ReservationConfirmeePage() {
  return (
    <div className="flex flex-col items-center py-16 px-4">

      {/* Grille d'images */}
      <div className="flex w-full max-w-3xl overflow-hidden rounded-2xl">
        {IMAGES.map((src, i) => (
          <div key={i} className="relative h-72 flex-1">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>
        ))}
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
