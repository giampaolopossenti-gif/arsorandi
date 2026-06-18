import { getAllWeeks } from "@/lib/content";
import Breadcrumb from "@/components/Breadcrumb";
import PercorsoMap from "@/components/PercorsoMap";

export default function PercorsoPage() {
  const weeks = getAllWeeks();
  return (
    <div>
      <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Il mio percorso" }]} />
      <h1 className="font-serif text-2xl font-medium mb-2" style={{ color: "var(--text)" }}>
        Il mio percorso
      </h1>
      <p className="font-sans text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        Tutte le sessioni del corso — quelle completate sono evidenziate.
      </p>
      <PercorsoMap weeks={weeks} />
    </div>
  );
}
