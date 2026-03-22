interface Section {
  title: string
  color: string
  lines: string[]
}

function getSectionColor(title: string): string {
  if (title.includes("INDICATOR READINGS")) return "var(--color-info)"
  if (title.includes("INDICATOR VOTE")) return "var(--color-gold)"
  if (title.includes("CURRENT SITUATION")) return "var(--color-info)"
  if (title.includes("ENTRY ASSESSMENT")) return "var(--color-gold)"
  if (title.includes("TRADE LEVELS")) return "var(--color-green)"
  if (title.includes("PRE-TRADE")) return "var(--color-green)"
  if (title.includes("BOTTOM LINE")) return "var(--color-accent)"
  return "var(--color-info)"
}

function parseSections(text: string): Section[] {
  const sections: Section[] = []
  let current: Section | null = null
  for (const line of text.split("\n")) {
    const t = line.trim()
    if (t.startsWith("## ")) {
      if (current) sections.push(current)
      const title = t.replace("## ", "")
      current = { title, color: getSectionColor(title), lines: [] }
    } else if (current && t && t !== "---") {
      current.lines.push(t)
    }
  }
  if (current) sections.push(current)
  return sections
}

function LineItem({ text }: { text: string }) {
  let color = "var(--color-white)"
  let fontWeight: "normal" | "bold" = "normal"
  const indent = text.startsWith("- ") || text.startsWith("* ") || text.startsWith("•")

  if (text.includes("BULLISH") && !text.includes("NOT BULLISH")) {
    color = "var(--color-green)"
    fontWeight = "bold"
  } else if (text.includes("BEARISH")) {
    color = "var(--color-red)"
    fontWeight = "bold"
  } else if (text.includes("NO TRADE") || text.includes("MIXED")) {
    color = "var(--color-gold)"
    fontWeight = "bold"
  } else if (text.includes("CONFIRMS") && !text.includes("NOT")) {
    color = "var(--color-green)"
  } else if (text.includes("DOES NOT CONFIRM")) {
    color = "var(--color-red)"
  } else if (text.includes("[x]") || text.includes("[X]")) {
    color = "var(--color-green)"
  } else if (text.includes("[ ]")) {
    color = "var(--color-red)"
  }

  // Bold label pattern: **Label:** rest
  const boldMatch = text.match(/^\*\*(.*?)\*\*(.*)/)
  if (boldMatch) {
    return (
      <div
        style={{
          marginBottom: 6,
          paddingLeft: indent ? 16 : 0,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "var(--color-white)", fontWeight: 500 }}>{boldMatch[1]}</span>
        <span style={{ color: "var(--color-muted)" }}>{boldMatch[2]}</span>
      </div>
    )
  }

  const clean = text.replace(/\*\*/g, "").replace(/^[-*•] /, "• ")
  return (
    <div
      style={{
        marginBottom: 6,
        paddingLeft: indent ? 16 : 0,
        color,
        fontWeight,
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      {clean}
    </div>
  )
}

interface AnalysisResultProps {
  text: string
}

export default function AnalysisResult({ text }: AnalysisResultProps) {
  const sections = parseSections(text)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sections.map((sec, i) => (
        <div
          key={i}
          className="animate-fade-up"
          style={{
            background: "var(--color-panel)",
            borderRadius: 8,
            border: "1px solid var(--color-divider)",
            overflow: "hidden",
            animationDelay: `${i * 60}ms`,
            opacity: 0,
          }}
        >
          <div
            style={{
              background: "var(--color-card)",
              borderLeft: `3px solid ${sec.color}`,
              padding: "12px 18px",
              fontWeight: 500,
              fontSize: 13,
              color: "var(--color-white)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {sec.title}
          </div>
          <div style={{ padding: "16px 18px" }}>
            {sec.lines.map((line, j) => (
              <LineItem key={j} text={line} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
