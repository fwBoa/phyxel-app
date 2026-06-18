import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const IMAGES = [
  '/assets/img/image-1.jpg',
  '/assets/img/image-2.jpg',
  '/assets/img/image-3.jpg',
  '/assets/img/image-4.jpg',
  '/assets/img/image-5.jpg',
]

export default function DevisConfirmationPage() {
  return (
    <div className="flex min-h-[calc(100vh-124px)] flex-col items-center justify-center px-4 py-12 sm:py-16">
      {/* Grille d’images */}
      <div className="flex w-full max-w-3xl overflow-hidden rounded-2xl">
        {IMAGES.map((src, i) => (
          <div key={i} className="relative h-48 flex-1 sm:h-72">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="20vw"
              priority
            />
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-[#1A844F] sm:text-4xl" style={{ fontFamily: 'var(--font-bricolage)' }}>
          Votre demande a bien été envoyée
        </h1>
        <p className="max-w-md text-[#65677A]">
          Nous étudions actuellement votre projet afin de vous proposer l’accompagnement le plus adapté à vos besoins. Nous reviendrons vers vous sous 48h ouvrées.
        </p>

        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#10111A] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Retour à l’accueil
        </Link>
      </div>
    </div>
  )
}
