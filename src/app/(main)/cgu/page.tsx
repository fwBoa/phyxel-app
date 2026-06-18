import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d’Utilisation — Phyxel',
  description: 'CGU de la plateforme Phyxel, marketplace de location d’espaces commerciaux éphémères.',
}

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Conditions Générales d’Utilisation</h1>
      <p className="mt-4 text-sm text-text-secondary">Dernière mise à jour : juin 2026</p>

      <section className="mt-10 space-y-6 text-sm leading-relaxed text-text-secondary">
        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">1. Objet</h2>
          <p>
            Les présentes CGU régissent l’utilisation de la plateforme Phyxel, qui met en relation des
            marques e-commerce (ci-après « Marques ») avec des propriétaires d’espaces physiques
            (ci-après « Hôtes »).
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">2. Inscription</h2>
          <p>
            L’utilisation de Phyxel nécessite la création d’un compte avec une adresse email valide.
            L’utilisateur s’engage à fournir des informations exactes et à maintenir la confidentialité
            de ses identifiants.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">3. Onboarding</h2>
          <p>
            Après inscription, la Marque complète un parcours de qualification en 5 étapes (secteur,
            objectifs, besoins, préférences, récapitulatif) afin de permettre à l’algorithme de
            matching de proposer des espaces pertinents.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">4. Réservation</h2>
          <p>
            La réservation d’un espace se fait en ligne via la plateforme. Elle est ferme et définitive
            à réception du paiement ou de l’acompte selon les conditions de l’Hôte. Phyxel prélève des
            frais de service de 15 % sur chaque transaction.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">5. Annulation et remboursement</h2>
          <p>
            Toute annulation par la Marque moins de 14 jours avant la date de début de location
            n’ouvre pas droit à remboursement. Au-delà, l’acompte est remboursé à 50 %. En cas
            d’annulation par l’Hôte, la Marque est intégralement remboursée.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">6. Responsabilité</h2>
          <p>
            Phyxel agit en qualité d’intermédiaire. La responsabilité de la plateforme est limitée au
            montant des frais de service perçus sur la transaction concernée. Les litiges entre
            Marque et Hôte relèvent de leur relation contractuelle directe.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">7. Données personnelles</h2>
          <p>
            Les données sont traitées par Phyxel en sa qualité de responsable de traitement, aux
            seules fins d’exécution du service. Voir notre{' '}
            <a href="/mentions-legales" className="text-primary hover:underline">politique de confidentialité</a>.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">8. Suspension de compte</h2>
          <p>
            Phyxel se réserve le droit de suspendre ou supprimer tout compte en cas de manquement aux
 présentes CGU, comportement frauduleux, ou non-respect des conditions de location.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">9. Modification des CGU</h2>
          <p>
            Phyxel peut modifier les présentes CGU à tout moment. Les utilisateurs sont informés par
            email et disposent d’un délai de 30 jours pour résilier leur compte en cas de désaccord.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">10. Droit applicable</h2>
          <p>Les présentes CGU sont soumises au droit français.</p>
        </div>
      </section>
    </div>
  )
}
