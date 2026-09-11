import Link from "next/link";

export interface NavigationLink {
  label: string;
  href: string;
}

interface NavigationProps {
  brand: string;
  links?: NavigationLink[];
}

export function Navigation({ brand, links = [] }: NavigationProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 px-[var(--page-padding)] py-6 mix-blend-difference">
      <Link
        href="/"
        className="text-sm uppercase tracking-[0.3em] text-white transition-opacity hover:opacity-70"
      >
        {brand}
      </Link>
      {links.length > 0 ? (
        <nav aria-label="Main">
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
