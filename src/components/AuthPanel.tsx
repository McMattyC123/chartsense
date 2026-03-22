import { useState, type CSSProperties } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

export default function AuthPanel() {
  const { user, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const panelStyle: CSSProperties = {
    background: "var(--color-panel)",
    border: "1px solid var(--color-divider)",
    borderRadius: 8,
    padding: "20px 24px",
    marginBottom: 24,
    fontFamily: "var(--font-body)",
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "var(--color-card)",
    border: "1px solid var(--color-divider)",
    borderRadius: 6,
    color: "var(--color-white)",
    padding: "12px 14px",
    fontSize: 14,
    marginBottom: 12,
    outline: "none",
    fontFamily: "var(--font-body)",
  }

  const btnPrimary: CSSProperties = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 8,
    border: "none",
    background: "var(--color-accent)",
    color: "white",
    fontSize: 14,
    fontWeight: 500,
    cursor: busy ? "not-allowed" : "pointer",
    fontFamily: "var(--font-body)",
    opacity: busy ? 0.7 : 1,
    transition: "opacity 0.2s ease",
  }

  if (loading) {
    return (
      <div style={{ ...panelStyle, color: "var(--color-muted)", fontSize: 14 }}>
        Loading session...
      </div>
    )
  }

  if (user) {
    const label = user.email ?? user.id
    return (
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          fontSize: 13,
          color: "var(--color-muted)",
          fontFamily: "var(--font-body)",
          padding: "12px 16px",
          background: "var(--color-panel)",
          borderRadius: 8,
          border: "1px solid var(--color-divider)",
        }}
      >
        <span
          title={label}
          style={{
            minWidth: 0,
            flex: "1 1 auto",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          Signed in as {label}
        </span>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "var(--color-muted)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            flexShrink: 0,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Sign out
        </button>
      </div>
    )
  }

  if (sent) {
    return (
      <div style={panelStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "var(--color-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-white)" }}>
              Check your email
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-muted)" }}>
              Click the link to sign in
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setError(null)
          }}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "var(--color-muted)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div style={panelStyle}>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--color-muted)", lineHeight: 1.5 }}>
        Sign in with your email address. We'll send you a secure link.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const trimmed = email.trim()
          if (!trimmed || busy) return
          setBusy(true)
          setError(null)
          const { error: err } = await supabase.auth.signInWithOtp({
            email: trimmed,
            options: { emailRedirectTo: `${window.location.origin}/analyze` },
          })
          setBusy(false)
          if (err) {
            setError(err.message)
            return
          }
          setSent(true)
        }}
      >
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          disabled={busy}
          required
        />
        {error && (
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--color-red)" }}>{error}</p>
        )}
        <button type="submit" style={btnPrimary} disabled={busy || !email.trim()}>
          {busy ? "Sending..." : "Send Sign-in Link"}
        </button>
      </form>
    </div>
  )
}
