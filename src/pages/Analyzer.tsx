import { useState, useCallback } from "react"
import AuthPanel from "@/components/AuthPanel"
import UploadZone from "@/components/UploadZone"
import AnalysisResult from "@/components/AnalysisResult"
import RateLimitBanner from "@/components/RateLimitBanner"
import { useAuth } from "@/contexts/AuthContext"
import { useRateLimit } from "@/hooks/useRateLimit"

export default function Analyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [b64, setB64] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState("image/png")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysisText, setAnalysisText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const { remaining, isLimited, increment } = useRateLimit()
  const { session, loading: authLoading } = useAuth()

  const handleImageLoad = useCallback((base64: string, dataUrl: string) => {
    const mt = dataUrl.match(/^data:([^;]+);/)?.[1] ?? "image/png"
    setMediaType(mt)
    setB64(base64)
    setImage(dataUrl)
    setAnalysisText("")
    setError(null)
  }, [])

  const handleClear = useCallback(() => {
    setImage(null)
    setB64(null)
    setMediaType("image/png")
    setAnalysisText("")
    setError(null)
    setNotes("")
  }, [])

  const analyze = async () => {
    if (!b64 || isLimited) return
    const token = session?.access_token
    if (!token) {
      setError("Sign in to analyze charts.")
      return
    }
    setLoading(true)
    setError(null)
    setAnalysisText("")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageBase64: b64,
          mediaType,
          notes: notes.trim() ? notes : undefined,
        }),
      })

      const data = (await res.json()) as { error?: string; text?: string }
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
      if (!data.text) throw new Error("Empty response from server")
      setAnalysisText(data.text)
      increment()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    handleClear()
    setAnalysisText("")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-dark)",
        color: "var(--color-white)",
        fontFamily: "var(--font-body)",
        padding: "32px 24px 60px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: 28,
            fontWeight: 400,
            fontFamily: "var(--font-heading)",
            color: "var(--color-white)",
          }}
        >
          Chart Analysis
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: "var(--color-muted)" }}>
          Upload a chart screenshot for structured technical analysis
        </p>
      </div>

      <AuthPanel />

      {/* Rate limit banner */}
      <RateLimitBanner
        remaining={remaining}
        isLimited={isLimited}
        onUpgradeClick={() => console.log("upgrade clicked — wire Stripe here")}
      />

      {/* Upload zone */}
      <div style={{ marginBottom: 16 }}>
        <UploadZone
          onImageLoad={handleImageLoad}
          image={image}
          onClear={handleClear}
          dragging={dragging}
          setDragging={setDragging}
        />
      </div>

      {/* Notes + analyze button */}
      {image && !analysisText && (
        <>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional context: pair, timeframe, or your current position..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "var(--color-panel)",
              border: "1px solid var(--color-divider)",
              borderRadius: 8,
              color: "var(--color-white)",
              padding: "14px 16px",
              fontSize: 14,
              resize: "vertical",
              minHeight: 72,
              marginBottom: 16,
              outline: "none",
              fontFamily: "var(--font-body)",
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={analyze}
            disabled={loading || isLimited || !session || authLoading}
            style={{
              width: "100%",
              padding: 16,
              background:
                loading || isLimited || !session || authLoading
                  ? "var(--color-divider)"
                  : "var(--color-accent)",
              border: "none",
              borderRadius: 8,
              color:
                loading || isLimited || !session || authLoading
                  ? "var(--color-muted)"
                  : "white",
              fontSize: 15,
              fontWeight: 500,
              cursor:
                loading || isLimited || !session || authLoading
                  ? "not-allowed"
                  : "pointer",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Analyzing...
              </>
            ) : !session ? (
              "Sign in to analyze"
            ) : (
              "Analyze Chart"
            )}
          </button>
        </>
      )}

      {/* Loading state */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            color: "var(--color-muted)",
            fontSize: 14,
            marginTop: 16,
            padding: "12px 0",
          }}
        >
          Reading chart indicators and generating analysis...
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-red)",
            borderRadius: 8,
            padding: "14px 18px",
            color: "var(--color-red)",
            fontSize: 14,
            marginTop: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Analysis output */}
      {analysisText && (
        <div style={{ marginTop: 24 }}>
          <AnalysisResult text={analysisText} />
          <button
            onClick={reset}
            style={{
              width: "100%",
              padding: 14,
              background: "var(--color-panel)",
              border: "1px solid var(--color-divider)",
              borderRadius: 8,
              color: "var(--color-muted)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              marginTop: 16,
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            Analyze Another Chart
          </button>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid var(--color-divider)",
          color: "var(--color-muted)",
          fontSize: 12,
        }}
      >
        For educational purposes only. Not financial advice.
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        animation: "spin 1s linear infinite",
      }}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>
    </svg>
  )
}
