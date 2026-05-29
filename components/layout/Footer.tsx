import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-hero text-primary-foreground text-sm font-bold shadow-card">
            P
          </span>
          <span className="text-foreground">Phyxel</span>
        </Link>

        <div className="flex gap-6">
          <Link href="#" className="hover:text-foreground">
            Mentions légales
          </Link>
          <Link href="#" className="hover:text-foreground">
            CGU
          </Link>
          <Link href="#" className="hover:text-foreground">
            Contact
          </Link>
          <Link href="#" className="hover:text-foreground">
            Blog
          </Link>
        </div>

        <span>© 2025 Phyxel</span>
      </div>
    </footer>
  );
}
