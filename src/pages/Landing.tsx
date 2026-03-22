import type { CSSProperties, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

const shell: CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "48px 24px 80px",
  color: "var(--color-white)",
  fontFamily: "var(--font-body)",
}

function Reveal({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true) // Start visible by default

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Reset to hidden state before observing
    setVisible(false)
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -48px 0px", threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={visible ? "animate-fade-up" : undefined}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(14px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const btnPrimary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "16px 32px",
  borderRadius: 8,
  background: "var(--color-accent)",
  color: "white",
  fontWeight: 500,
  fontSize: 15,
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  transition: "background 0.2s ease",
}

const btnSecondary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "16px 32px",
  borderRadius: 8,
  background: "transparent",
  color: "var(--color-white)",
  fontWeight: 500,
  fontSize: 15,
  textDecoration: "none",
  border: "1px solid var(--color-divider)",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  transition: "all 0.2s ease",
}

export default function Landing() {
  return (
    <div style={shell}>
      {/* 1. HERO */}
      <Reveal>
        <section style={{ marginBottom: 80, textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--color-muted)",
              textTransform: "uppercase",
            }}
          >
            Chart Analysis Education
          </p>
          <h1
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(2.25rem, 6vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-white)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Learn to Read Charts
            <br />
            <span style={{ fontStyle: "italic" }}>with Clarity</span>
          </h1>
          <p
            style={{
              margin: "0 auto 32px",
              fontSize: 17,
              lineHeight: 1.65,
              color: "var(--color-muted)",
              maxWidth: 520,
            }}
          >
            A structured approach to technical analysis using five proven indicators.
            Built for learning, not speculation.
          </p>
          <div className="landing-hero-actions" style={{ marginBottom: 24, justifyContent: "center" }}>
            <Link to="/analyze" style={btnPrimary}>
              Try the Analyzer
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/guide" style={btnSecondary}>
              Read the Methodology
            </Link>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "var(--color-muted)",
            }}
          >
            Educational tool for understanding market structure
          </p>
        </section>
      </Reveal>

      {/* 2. TRUST INDICATORS */}
      <Reveal>
        <section style={{ marginBottom: 80 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--color-divider)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <TrustStat number="5" label="Core Indicators" />
            <TrustStat number="7" label="Analysis Sections" />
            <TrustStat number="1" label="Clear Framework" />
          </div>
        </section>
      </Reveal>

      {/* 3. THE APPROACH */}
      <Reveal>
        <section style={{ marginBottom: 80 }}>
          <SectionLabel>The Approach</SectionLabel>
          <h2
            style={{
              margin: "0 0 24px",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 400,
              fontFamily: "var(--font-heading)",
              color: "var(--color-white)",
            }}
          >
            Less indicators. More understanding.
          </h2>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--color-muted)",
            }}
          >
            Most traders struggle not from lack of tools, but from too many conflicting signals.
            The Less Is More methodology focuses on five indicators that cover all essential
            dimensions of price analysis without redundancy.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <IndicatorRow
              name="Bollinger Bands"
              setting="BB(15,2)"
              desc="Volatility and dynamic support/resistance"
              color="var(--color-info)"
            />
            <IndicatorRow
              name="MACD"
              setting="8/21/5"
              desc="Momentum direction and divergence signals"
              color="var(--color-info)"
            />
            <IndicatorRow
              name="RSI"
              setting="RSI(9)"
              desc="Speed and exhaustion of price movement"
              color="var(--color-purple)"
            />
            <IndicatorRow
              name="Volume"
              setting="20 MA"
              desc="Validates conviction behind price moves"
              color="var(--color-green)"
            />
            <IndicatorRow
              name="HTF Bias"
              setting="1H context"
              desc="Filters trades against the larger trend"
              color="var(--color-gold)"
            />
          </div>
        </section>
      </Reveal>

      {/* 4. HOW IT WORKS */}
      <Reveal>
        <section style={{ marginBottom: 80 }}>
          <SectionLabel>How It Works</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <ProcessStep number="01" title="Upload Your Chart">
              Take a screenshot of any chart with your preferred indicators visible.
              PNG or JPG format accepted.
            </ProcessStep>
            <ProcessStep number="02" title="Add Context">
              Optionally provide notes about the pair, timeframe, or your current
              position for more relevant analysis.
            </ProcessStep>
            <ProcessStep number="03" title="Receive Structured Analysis">
              Get a comprehensive 7-section breakdown covering indicator readings,
              situation assessment, and actionable trade levels.
            </ProcessStep>
          </div>
        </section>
      </Reveal>

      {/* 5. OUTPUT PREVIEW */}
      <Reveal>
        <section style={{ marginBottom: 80 }}>
          <SectionLabel>Analysis Output</SectionLabel>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--color-muted)",
            }}
          >
            Every analysis follows a consistent structure, providing clear and actionable
            insights rather than vague commentary.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {[
              "Indicator Readings",
              "Indicator Vote",
              "Current Situation",
              "Entry Assessment",
              "Trade Levels",
              "Pre-Trade Checklist",
              "Bottom Line",
            ].map((label) => (
              <span
                key={label}
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-muted)",
                  background: "var(--color-panel)",
                  border: "1px solid var(--color-divider)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 6. PRICING */}
      <Reveal>
        <section style={{ marginBottom: 80 }}>
          <SectionLabel>Pricing</SectionLabel>
          <div className="landing-pricing-grid">
            <div
              style={{
                padding: 32,
                borderRadius: 12,
                background: "var(--color-panel)",
                border: "1px solid var(--color-divider)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-muted)", marginBottom: 4 }}>
                  Free
                </div>
                <div style={{ fontSize: 32, fontWeight: 400, color: "var(--color-white)", fontFamily: "var(--font-heading)" }}>
                  $0
                </div>
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  color: "var(--color-muted)",
                  fontSize: 14,
                  lineHeight: 2,
                  flex: 1,
                }}
              >
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckIcon /> 3 analyses per day
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckIcon /> Full 7-section analysis
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckIcon /> Complete methodology guide
                </li>
              </ul>
              <Link to="/analyze" style={{ ...btnSecondary, width: "100%", boxSizing: "border-box" }}>
                Get Started
              </Link>
            </div>

            <div
              style={{
                padding: 32,
                borderRadius: 12,
                background: "var(--color-panel)",
                border: "2px solid var(--color-accent)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-muted)", marginBottom: 4 }}>
                  Pro
                </div>
                <div style={{ fontSize: 32, fontWeight: 400, color: "var(--color-white)", fontFamily: "var(--font-heading)" }}>
                  $8<span style={{ fontSize: 16, fontWeight: 400, color: "var(--color-muted)" }}>/month</span>
                </div>
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  color: "var(--color-muted)",
                  fontSize: 14,
                  lineHeight: 2,
                  flex: 1,
                }}
              >
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckIcon /> Unlimited analyses
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckIcon /> Analysis history
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckIcon /> Priority support
                </li>
              </ul>
              <button type="button" style={{ ...btnPrimary, width: "100%", boxSizing: "border-box" }}>
                Upgrade to Pro
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 7. FOOTER */}
      <Reveal>
        <footer
          style={{
            paddingTop: 40,
            borderTop: "1px solid var(--color-divider)",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 400, color: "var(--color-white)", fontFamily: "var(--font-heading)" }}>
            ChartSense
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Link
              to="/analyze"
              style={{ color: "var(--color-muted)", fontSize: 14, textDecoration: "none" }}
            >
              Analyzer
            </Link>
            <Link
              to="/guide"
              style={{ color: "var(--color-muted)", fontSize: 14, textDecoration: "none" }}
            >
              Methodology
            </Link>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-muted)", lineHeight: 1.6 }}>
            For educational purposes only. Not financial advice.
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-muted)" }}>
            © 2026 Bar Book LLC
          </p>
        </footer>
      </Reveal>
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 12px",
        fontSize: 12,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--color-muted)",
      }}
    >
      {children}
    </p>
  )
}

function TrustStat({ number, label }: { number: string; label: string }) {
  return (
    <div
      style={{
        padding: "28px 20px",
        background: "var(--color-panel)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: "var(--color-white)",
          fontFamily: "var(--font-heading)",
          marginBottom: 4,
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: 13, color: "var(--color-muted)" }}>{label}</div>
    </div>
  )
}

function IndicatorRow({
  name,
  setting,
  desc,
  color,
}: {
  name: string
  setting: string
  desc: string
  color: string
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        padding: "16px 20px",
        borderRadius: 8,
        background: "var(--color-panel)",
        border: "1px solid var(--color-divider)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          marginTop: 6,
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: 500, fontSize: 15, color: "var(--color-white)" }}>{name}</span>
          <span
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {setting}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  )
}

function ProcessStep({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-muted)",
          fontFamily: "var(--font-mono)",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {number}
      </span>
      <div>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 17,
            fontWeight: 500,
            color: "var(--color-white)",
          }}
        >
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-muted)" }}>{children}</p>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-green)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
