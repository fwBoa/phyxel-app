import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-hero text-primary-foreground text-sm font-bold shadow-card">
            P
          </span>
          <span className="text-foreground">Phyxel</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/search" className="hover:text-foreground transition-colors">
            Explorer
          </Link>
          <Link href="#how" className="hover:text-foreground transition-colors">
            Comment ça marche
          </Link>
          <Link href="#why" className="hover:text-foreground transition-colors">
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </header>
  );
}
