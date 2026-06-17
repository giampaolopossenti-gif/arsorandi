import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="font-sans text-xs mb-8 flex flex-wrap gap-1 items-center" style={{ color: "var(--text-muted)" }}>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span>›</span>}
          {c.href ? (
            <Link href={c.href} className="hover:underline" style={{ color: "var(--text-muted)" }}>
              {c.label}
            </Link>
          ) : (
            <span style={{ color: "var(--text)" }}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
