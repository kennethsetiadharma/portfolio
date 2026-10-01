import { site } from "@/content/site";

// Floating pill, centred at the top. Links come from `site.nav`.
export function Nav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <ul className="flex items-center gap-1 rounded-full border border-white/60 bg-white/60 p-1 shadow-sm backdrop-blur-md">
        {site.nav.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="block rounded-full px-4 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:outline-none"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
