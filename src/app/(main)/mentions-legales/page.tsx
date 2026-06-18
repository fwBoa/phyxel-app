import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales — Phyxel',
  description: 'Mentions légales du site Phyxel, marketplace de location d’espaces commerciaux éphémères.',
}

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Mentions légales</h1>
      <p className="mt-4 text-sm text-text-secondary">Dernière mise à jour : juin 2026</p>

      <section className="mt-10 space-y-6 text-sm leading-relaxed text-text-secondary">
        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">1. Éditeur du site</h2>
          <p>
            <strong className="text-foreground">Phyxel</strong> — Marketplace de location d’espaces
            physiques éphémères pour marques e-commerce.
          </p>
          <p className="mt-2">
            Contact : <a href="mailto:agencephyxel@gmail.com" className="text-primary hover:underline">agencephyxel@gmail.com</a>
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">2. Hébergement</h2>
          <p>
            Le site est hébergé par <strong className="text-foreground">Vercel Inc.</strong> — 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">3. Propriété intellectuelle</h2>
          <p>
            L’ensemble des éléments du site (textes, images, logos, code source, design) est la propriété
            exclusive de Phyxel ou de ses partenaires. Toute reproduction, même partielle, est interdite
            sans autorisation préalable.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">4. Données personnelles</h2>
          <p>
            Les données collectées via le site sont traitées conformément à notre{' '}
            <a href="/cgu" className="text-primary hover:underline">politique de confidentialité</a>.
            Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression
            de vos données : <a href="mailto:agencephyxel@gmail.com" className="text-primary hover:underline">agencephyxel@gmail.com</a>.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">5. Cookies</h2>
          <p>
            Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement
            (session d’authentification Supabase, préférences d’affichage). Aucun cookie publicitaire
            ou de tracking tiers.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">6. Responsabilité</h2>
          <p>
            Phyxel met tout en œuvre pour assurer l’exactitude des informations publiées, mais ne saurait
            garantir leur exhaustivité. L’utilisation du site se fait sous l’entière responsabilité de
            l’utilisateur.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">7. Droit applicable</h2>
          <p>Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </div>
      </section>
    </div>
  )
}
