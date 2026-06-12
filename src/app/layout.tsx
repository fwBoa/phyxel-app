import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Phyxel — Trouvez le lieu physique idéal pour votre marque e-commerce',
  description:
    'Phyxel connecte les marques e-commerce avec des espaces physiques adaptés : showrooms, pop-ups, corners. Réservation en 48h.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#0A0A0A]">
        {children}
      </body>
    </html>
  )
}
