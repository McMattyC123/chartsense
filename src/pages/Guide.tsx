import type { CSSProperties, ReactNode } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

const SECTION_GAP = 80
const CARD_GAP = 24
const CARD_PAD = 24

const shell: CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "48px 24px 80px",
  color: "var(--color-white)",
  fontFamily: "var(--font-body)",
}

const sectionLabelFive: CSSProperties = {
  margin: `0 0 16px`,
  fontSize: 12,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-muted)",
}

function Reveal({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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

const btnAccent: CSSProperties = {
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

const INDICATOR_IDS = ["guide-bb", "guide-macd", "guide-rsi", "guide-vol", "guide-htf"] as const
const INDICATOR_LABELS = ["BB", "MACD", "RSI", "Vol", "HTF"] as const
const INDICATOR_COLORS = [
  "var(--color-accent)",
  "var(--color-accent)",
  "#9c27b0",
  "var(--color-green)",
  "var(--color-gold)",
] as const

export default function Guide() {
  const heroRef = useRef<HTMLElement>(null)
  const [showStickyNav, setShowStickyNav] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  const updateScrollState = useCallback(() => {
    const hero = heroRef.current
    if (hero) {
      const heroRect = hero.getBoundingClientRect()
      setShowStickyNav(heroRect.bottom < 0)
    }
    const marker = window.scrollY + window.innerHeight * 0.32
    let idx = 0
    for (let i = 0; i < INDICATOR_IDS.length; i++) {
      const el = document.getElementById(INDICATOR_IDS[i])
      if (!el) continue
      const top = el.getBoundingClientRect().top + window.scrollY
      if (top <= marker) idx = i
    }
    setActiveIdx(idx)
  }, [])

  useEffect(() => {
    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [updateScrollState])

  const scrollToIndicator = useCallback((i: number) => {
    const id = INDICATOR_IDS[i]
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <div style={shell}>
      <nav
        className={`guide-sticky-progress${showStickyNav ? " guide-sticky-progress--visible" : ""}`}
        aria-hidden={!showStickyNav}
      >
        <div className="guide-sticky-progress__track">
          <div className="guide-sticky-progress__line" aria-hidden />
          {INDICATOR_LABELS.map((label, i) => {
            const color = INDICATOR_COLORS[i]
            const active = i === activeIdx
            return (
              <button
                key={label}
                type="button"
                className="guide-sticky-progress__step"
                onClick={() => scrollToIndicator(i)}
                title={`Go to ${label}`}
              >
                <span
                  className="guide-sticky-progress__dot"
                  style={{
                    borderColor: color,
                    background: active ? color : "transparent",
                    boxShadow: active ? `0 0 0 2px color-mix(in srgb, ${color} 35%, transparent)` : undefined,
                  }}
                />
                <span className="guide-sticky-progress__label" style={{ color: active ? "var(--color-white)" : "var(--color-muted)" }}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* 1. HERO */}
      <Reveal>
        <section ref={heroRef} style={{ marginBottom: SECTION_GAP }}>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
              textTransform: "uppercase",
            }}
          >
            The Methodology
          </p>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(2.25rem, 6vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              fontFamily: "var(--font-heading)",
            }}
          >
            Less Is More
          </h1>
          <p style={{ margin: "0 0 24px", fontSize: 17, lineHeight: 1.65, color: "var(--color-muted)" }}>
            Five indicators that cover all essential dimensions of price analysis.
          </p>
          <div className="guide-hero-tags" role="navigation" aria-label="Jump to indicator sections">
            {(["BB", "MACD", "RSI", "Volume", "HTF Bias"] as const).map((label, i) => (
              <button
                key={label}
                type="button"
                className="guide-hero-tag"
                onClick={() => scrollToIndicator(i)}
                aria-label={`Go to ${label} section`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 2. PHILOSOPHY */}
      <Reveal>
        <section style={{ marginBottom: SECTION_GAP }}>
          <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.65, color: "var(--color-muted)" }}>
            Most traders lose not because they lack indicators — but because they have too many. Every indicator added
            beyond these five is redundant data wearing a different costume.
          </p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--color-white)", fontWeight: 600 }}>
            This guide covers exactly what you need. Nothing more.
          </p>
        </section>
      </Reveal>

      {/* 3. FIVE INDICATORS */}
      <Reveal>
        <section style={{ marginBottom: SECTION_GAP }}>
          <h2 style={sectionLabelFive}>The five indicators</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP }}>
            <div id="guide-bb">
              <IndicatorCard accentColor="var(--color-accent)" title="Bollinger Bands">
                <p className="mono" style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-accent)", lineHeight: 1.5 }}>
                  Setting: BB(15, 2) · Type: Volatility + Support/Resistance
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)" }}>
                  Middle band is a 20-period moving average — your rolling mean and first profit target.
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)" }}>
                  Upper and lower bands expand and contract with volatility — a squeeze warns that a large move is coming.
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)" }}>
                  Price position relative to the bands shows whether price is stretched for a snap-back or riding a trend.
                </p>
                <SignalTable
                  dotColor="var(--color-accent)"
                  rows={[
                    ["BB Squeeze", "Volatility about to explode — prepare"],
                    ["Price at lower band", "Potential long — wait for confirmation"],
                    ["Price at upper band", "Potential short — wait for rejection"],
                    ["Band walkdown", "Strong downtrend — do NOT buy"],
                    ["Middle band", "Always your first profit target (TP1)"],
                  ]}
                />
                <CalloutAmber>
                  Never buy just because price touches the lower band. Wait for a candle to close back inside.
                </CalloutAmber>
              </IndicatorCard>
            </div>

            <div id="guide-macd">
              <IndicatorCard accentColor="var(--color-accent)" title="MACD">
                <p className="mono" style={{ margin: "0 0 14px", fontSize: 12, color: "var(--color-accent)", lineHeight: 1.5 }}>
                  Setting: 8 / 21 / 5 · Type: Momentum + Trend Direction
                </p>
                <SignalTable
                  dotColor="var(--color-accent)"
                  rows={[
                    ["Bullish crossover", "Momentum turning up — watch for entry"],
                    ["Bearish crossover", "Momentum turning down — watch for exit"],
                    ["Histogram growing", "Momentum accelerating — trade is working"],
                    ["Histogram shrinking", "Momentum fading — tighten stop"],
                    ["Divergence", "Highest probability reversal signal"],
                  ]}
                />
                <CalloutInfo>
                  Standard 12/26/9 was designed for daily charts. On intraday it lags. Always use 8/21/5 for day trading.
                </CalloutInfo>
              </IndicatorCard>
            </div>

            <div id="guide-rsi">
              <IndicatorCard accentColor="#9c27b0" title="RSI">
                <p className="mono" style={{ margin: "0 0 14px", fontSize: 12, color: "var(--color-rsi-purple)", lineHeight: 1.5 }}>
                  Setting: RSI(9) · Levels: 60 overbought / 40 oversold
                </p>
                <SignalTable
                  dotColor="#9c27b0"
                  rows={[
                    ["Below 40 curling up", "Potential long — confirm with BB + MACD"],
                    ["Above 60 curling down", "Potential short — confirm with BB + MACD"],
                    ["Crosses 50 upward", "Bullish trend confirmation"],
                    ["Crosses 50 downward", "Bearish trend confirmation"],
                    ["Divergence", "Strong reversal signal — combine with MACD div"],
                  ]}
                />
                <CalloutAmber>
                  RSI can stay above 60 for a long time in a strong trend. Overbought does not mean sell.
                </CalloutAmber>
              </IndicatorCard>
            </div>

            <div id="guide-vol">
              <IndicatorCard accentColor="var(--color-green)" title="Volume">
                <p className="mono" style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-green)", lineHeight: 1.5 }}>
                  Setting: 20-period MA · Type: Participation Confirmation
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)" }}>
                  <strong style={{ color: "var(--color-white)" }}>Why it&apos;s different:</strong> Every other indicator is
                  derived from price. Volume is independent. It tells you if real money is behind the move.
                </p>
                <SignalTable
                  dotColor="var(--color-green)"
                  rows={[
                    ["Above average on signal candle", "Signal is valid — real conviction"],
                    ["Below average on signal candle", "Signal is suspect — reduce size"],
                    ["High volume at BB band touch", "Strong reversal — good entry"],
                    ["Declining volume on rally", "Weak move — tighten stop"],
                  ]}
                />
                <CalloutGreen>
                  Before any entry — is volume confirming? If not, cut size in half or skip entirely.
                </CalloutGreen>
              </IndicatorCard>
            </div>

            <div id="guide-htf">
              <IndicatorCard accentColor="var(--color-gold)" title="Higher Timeframe Bias">
                <p className="mono" style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-gold)", lineHeight: 1.5 }}>
                  Setting: Check 1H before trading 15m · Type: Trend Context Filter
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)" }}>
                  <strong style={{ color: "var(--color-white)" }}>The concept:</strong> Every signal on your trading chart
                  exists inside a larger trend. A perfect-looking 15m long setup inside a 1H downtrend has a fraction of the
                  probability.
                </p>
                <HtfTable dotColor="var(--color-gold)" />
                <p style={{ margin: "14px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--color-muted)" }}>
                  <strong style={{ color: "var(--color-gold)" }}>Rule:</strong> If 2 of 3 indicators on the HTF say bearish
                  — only take short signals on your trading timeframe. Ignore all long signals.
                </p>
              </IndicatorCard>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 4. PRE-TRADE PROCESS */}
      <Reveal>
        <section style={{ marginBottom: SECTION_GAP }}>
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--color-muted)",
            }}
          >
            The pre-trade process
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              <>
                <span style={{ color: "var(--color-white)", fontWeight: 600 }}>Check the higher timeframe bias</span> (10
                seconds)
              </>,
              <>
                <span style={{ color: "var(--color-white)", fontWeight: 600 }}>Identify key support/resistance levels</span>
              </>,
              <>
                <span style={{ color: "var(--color-white)", fontWeight: 600 }}>Note the BB state</span> — trending or
                squeezing?
              </>,
              <>
                <span style={{ color: "var(--color-white)", fontWeight: 600 }}>Check for major news</span> in the next 15
                minutes
              </>,
              <>
                <span style={{ color: "var(--color-white)", fontWeight: 600 }}>Wait for a signal candle to CLOSE</span> —
                never trade mid-candle
              </>,
              <>
                <span style={{ color: "var(--color-white)", fontWeight: 600 }}>Run the vote</span> — need 2 of 5
                indicators to agree minimum
              </>,
            ].map((content, i, arr) => (
              <PreTradeStep key={i} step={i + 1} isLast={i === arr.length - 1}>
                {content}
              </PreTradeStep>
            ))}
          </div>
          <CalloutGreen style={{ marginTop: 20 }}>
            <span style={{ color: "var(--color-green)", fontWeight: 700 }}>Execution: </span>
            Set your stop loss BEFORE you enter. Target 1 is always the middle BB band. Take 50% off there. Move stop to
            breakeven. Let the rest run.
          </CalloutGreen>
        </section>
      </Reveal>

      {/* 5. WHAT TO IGNORE */}
      <Reveal>
        <section style={{ marginBottom: SECTION_GAP }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
            }}
          >
            Redundant Indicators
          </p>
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 400,
              fontFamily: "var(--font-heading)",
              color: "var(--color-white)",
            }}
          >
            What to leave out
          </h2>
          <p style={{ margin: "0 0 24px", fontSize: 15, lineHeight: 1.7, color: "var(--color-muted)" }}>
            The most valuable skill is knowing what to remove. These indicators are not necessary
            for this methodology as they duplicate information already covered.
          </p>
          <div className="guide-ignore-grid" style={{ marginBottom: 20 }}>
            {[
              ["Stochastic", "Redundant with RSI — measures the same momentum"],
              ["CCI", "Another momentum oscillator — already covered by MACD/RSI"],
              ["Parabolic SAR", "Lags behind price — Bollinger Bands serve this purpose"],
              ["Multiple EMAs", "Middle BB band is already a moving average"],
              ["Fibonacci", "Subjective placement — varies between analysts"],
              ["Ichimoku", "Comprehensive but conflicts with this framework"],
            ].map(([name, why]) => (
              <div
                key={name}
                style={{
                  padding: "16px 18px",
                  borderRadius: 6,
                  background: "var(--color-panel)",
                  border: "1px solid var(--color-divider)",
                }}
              >
                <div style={{ fontWeight: 500, fontSize: 14, color: "var(--color-white)", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-muted)" }}>{why}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 6,
              background: "var(--color-card)",
              border: "1px solid var(--color-divider)",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--color-muted)",
            }}
          >
            <span style={{ fontWeight: 500, color: "var(--color-white)" }}>Rule of thumb:</span> If a new indicator
            measures Trend, Momentum, Volatility, or Volume — it's likely redundant. All four categories are
            already covered.
          </div>
        </section>
      </Reveal>

      {/* 6. CTA */}
      <Reveal>
        <section
          style={{
            textAlign: "center",
            paddingTop: 24,
            paddingBottom: 16,
            borderTop: "1px solid var(--color-divider)",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
              fontWeight: 400,
              color: "var(--color-white)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Ready to apply the methodology?
          </h2>
          <Link to="/analyze" style={btnAccent}>
            Try the Analyzer
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      </Reveal>
    </div>
  )
}

function IndicatorCard({
  accentColor,
  title,
  children,
}: {
  accentColor: string
  title: string
  children: ReactNode
}) {
  return (
    <article
      style={{
        padding: 0,
        borderRadius: 8,
        background: "var(--color-panel)",
        border: "1px solid var(--color-divider)",
        borderLeft: `3px solid ${accentColor}`,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 24px", background: "var(--color-card)", borderBottom: "1px solid var(--color-divider)" }}>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 500,
            color: "var(--color-white)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </h3>
      </div>
      <div style={{ padding: CARD_PAD }}>{children}</div>
    </article>
  )
}

const signalTableBase: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse" as const,
  fontSize: 13,
  marginTop: 16,
}

const cellBase: CSSProperties = {
  padding: "12px 14px",
  textAlign: "left" as const,
  verticalAlign: "top" as const,
  borderBottom: "1px solid var(--color-divider)",
}

const thStyle: CSSProperties = {
  ...cellBase,
  background: "var(--color-card)",
  color: "var(--color-muted)",
  fontSize: 11,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontFamily: "var(--font-body)",
  borderBottom: "1px solid var(--color-divider)",
}

function SignalTable({ rows, dotColor }: { rows: [string, string][]; dotColor: string }) {
  return (
    <table style={signalTableBase}>
      <thead>
        <tr>
          <th style={{ ...thStyle, width: "42%" }}>Signal</th>
          <th style={thStyle}>Meaning</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([sig, mean], rowIdx) => (
          <tr
            key={sig}
            style={{
              background: rowIdx % 2 === 0 ? "var(--color-panel)" : "var(--color-card)",
            }}
          >
            <td style={{ ...cellBase, fontWeight: 500, color: "var(--color-white)" }}>
              <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 6,
                    height: 6,
                    marginTop: 5,
                    borderRadius: "50%",
                    background: dotColor,
                  }}
                />
                {sig}
              </span>
            </td>
            <td style={{ ...cellBase, color: "var(--color-muted)", fontWeight: 400 }}>{mean}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function HtfTable({ dotColor }: { dotColor: string }) {
  const rows: [string, string][] = [
    ["5m", "15m–1H"],
    ["15m", "1H"],
    ["1H", "4H"],
    ["4H", "Daily"],
  ]
  return (
    <table style={signalTableBase}>
      <thead>
        <tr>
          <th style={{ ...thStyle }}>Your Timeframe</th>
          <th style={{ ...thStyle }}>Check Higher TF</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([a, b], rowIdx) => (
          <tr
            key={a}
            style={{
              background: rowIdx % 2 === 0 ? "var(--color-panel)" : "var(--color-card)",
            }}
          >
            <td style={{ ...cellBase, fontWeight: 500, color: "var(--color-white)", fontFamily: "var(--font-mono)" }}>
              <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 6,
                    height: 6,
                    marginTop: 5,
                    borderRadius: "50%",
                    background: dotColor,
                  }}
                />
                {a}
              </span>
            </td>
            <td style={{ ...cellBase, color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CalloutAmber({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 18px",
        borderRadius: 6,
        background: "var(--color-card)",
        borderLeft: "3px solid var(--color-gold)",
        fontSize: 13,
        lineHeight: 1.6,
        color: "var(--color-muted)",
      }}
    >
      <span style={{ fontWeight: 500, color: "var(--color-gold)", marginRight: 8 }}>
        Note:
      </span>
      {children}
    </div>
  )
}

function CalloutGreen({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 18px",
        borderRadius: 6,
        background: "var(--color-card)",
        borderLeft: "3px solid var(--color-green)",
        fontSize: 13,
        lineHeight: 1.6,
        color: "var(--color-muted)",
        ...style,
      }}
    >
      <span style={{ fontWeight: 500, color: "var(--color-green)", marginRight: 8 }}>
        Key:
      </span>
      {children}
    </div>
  )
}

function CalloutInfo({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: "16px 0 0",
        padding: "14px 18px",
        borderRadius: 6,
        background: "var(--color-card)",
        borderLeft: "3px solid var(--color-info)",
        fontSize: 13,
        lineHeight: 1.6,
        color: "var(--color-muted)",
      }}
    >
      <span style={{ fontWeight: 500, color: "var(--color-info)", marginRight: 8 }}>
        Tip:
      </span>
      {children}
    </p>
  )
}

function PreTradeStep({
  step,
  isLast,
  children,
}: {
  step: number
  isLast: boolean
  children: ReactNode
}) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          width: 36,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-muted)",
            lineHeight: 1.6,
            fontFamily: "var(--font-mono)",
          }}
        >
          {String(step).padStart(2, '0')}
        </span>
        {!isLast ? (
          <div
            style={{
              width: 0,
              minHeight: 24,
              marginTop: 8,
              marginBottom: 4,
              borderLeft: "1px solid var(--color-divider)",
            }}
          />
        ) : null}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16, fontSize: 15, lineHeight: 1.7, color: "var(--color-muted)" }}>
        {children}
      </div>
    </div>
  )
}
