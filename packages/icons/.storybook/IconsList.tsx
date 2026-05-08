import { useMemo, useState, type ComponentType, type SVGProps } from "react";

type SVGComponent = ComponentType<SVGProps<SVGSVGElement>>;
type SVGIcons = Record<string, SVGComponent>;

type Props = {
  icons: SVGIcons;
  defaultSize?: number;
};

const isComponent = (value: unknown): value is SVGComponent =>
  typeof value === "function" || typeof value === "object";

export default function IconsList({ icons, defaultSize = 32 }: Props) {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(defaultSize);
  const [copied, setCopied] = useState<string | null>(null);

  const entries = useMemo(
    () =>
      Object.entries(icons).filter(([name, value]) => name !== "default" && isComponent(value)),
    [icons],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(([name]) => name.toLowerCase().includes(q));
  }, [entries, query]);

  const copy = (name: string) => {
    const importLine = `import { ${name} } from "@epignosis_llc/ui-icons";`;
    void navigator.clipboard.writeText(importLine);
    setCopied(name);
    window.setTimeout(() => setCopied((current) => (current === name ? null : current)), 1200);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${entries.length} icons…`}
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: 13 }}>
          Size
          <input
            type="number"
            min={12}
            max={96}
            value={size}
            onChange={(e) => setSize(Number(e.target.value) || defaultSize)}
            style={{
              width: 64,
              padding: "0.4rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />
        </label>
        <span style={{ fontSize: 13, color: "#666" }}>{filtered.length} match</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "1rem",
        }}
      >
        {filtered.map(([name, Icon]) => {
          const isCopied = copied === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => copy(name)}
              title={`Click to copy: import { ${name} } from "@epignosis_llc/ui-icons"`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 0.5rem",
                background: "#fff",
                border: `1px solid ${isCopied ? "#0046AB" : "#e5e7eb"}`,
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "center",
                transition: "border-color 0.15s ease, transform 0.15s ease",
                color: "#1f2937",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0046AB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isCopied ? "#0046AB" : "#e5e7eb";
              }}
            >
              <span
                style={{
                  height: size,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon height={size} />
              </span>
              <span
                style={{
                  fontSize: 11,
                  wordBreak: "break-all",
                  lineHeight: 1.3,
                  color: isCopied ? "#0046AB" : "#4b5563",
                }}
              >
                {isCopied ? "Copied!" : name}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ color: "#666", fontSize: 14, gridColumn: "1 / -1" }}>No icons match.</p>
        )}
      </div>
    </div>
  );
}
