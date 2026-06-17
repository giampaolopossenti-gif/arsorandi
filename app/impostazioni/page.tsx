import Breadcrumb from "@/components/Breadcrumb";
import ResetButton from "@/components/ResetButton";

export default function ImpostazioniPage() {
  return (
    <div>
      <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Impostazioni" }]} />
      <h1 className="font-serif text-2xl font-medium mb-10" style={{ color: "var(--text)" }}>
        Impostazioni
      </h1>
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <div className="font-sans font-medium text-sm mb-1" style={{ color: "var(--text)" }}>
          Azzera tutti i progressi
        </div>
        <p className="font-sans text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          Rimuove tutte le sessioni segnate come completate. L&apos;operazione non può essere annullata.
        </p>
        <ResetButton />
      </div>
    </div>
  );
}
