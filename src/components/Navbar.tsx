import type { CSSProperties } from "react"
import { Link, NavLink } from "react-router-dom"

const linkBase: CSSProperties = {
  color: "var(--color-muted)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: 6,
  whiteSpace: "nowrap",
  transition: "color 0.2s ease",
}

export default function Navbar() {
  return (
    <header
      style={{
        background: "var(--color-panel)",
        borderBottom: "1px solid var(--color-divider)",
        padding: "12px 24px",
      }}
    >
      <nav
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          rowGap: 12,
        }}
      >
        <Link
          to="/"
          style={{
            color: "var(--color-white)",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: 17,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-heading)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="M7 16l4-4 4 4 5-6" />
          </svg>
          <span>ChartSense</span>
        </Link>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 4,
            justifyContent: "flex-end",
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          <NavLink
            to="/guide"
            style={({ isActive }) => ({
              ...linkBase,
              color: isActive ? "var(--color-white)" : "var(--color-muted)",
              background: isActive ? "var(--color-card)" : "transparent",
            })}
          >
            Methodology
          </NavLink>
          <Link
            to="/analyze"
            style={{
              ...linkBase,
              background: "var(--color-accent)",
              color: "white",
              border: "none",
            }}
          >
            Analyze
          </Link>
        </div>
      </nav>
    </header>
  )
}
