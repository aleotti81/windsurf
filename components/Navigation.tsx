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
    <header className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-[var(--page-padding)] py-5 mix-blend-difference sm:gap-6 sm:py-6">
      <Link
        href="/"
        className="text-[0.6875rem] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-70 sm:text-sm sm:tracking-[0.3em]"
      >
        {brand}
      </Link>
      {links.length > 0 ? (
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.625rem] uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white sm:text-xs sm:tracking-[0.2em]"
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
