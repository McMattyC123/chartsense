import { FREE_LIMIT } from "@/lib/constants"

interface RateLimitBannerProps {
  remaining: number
  isLimited: boolean
  onUpgradeClick: () => void
}

export default function RateLimitBanner({
  remaining,
  isLimited,
  onUpgradeClick,
}: RateLimitBannerProps) {
  if (isLimited) {
    return (
      <div
        className="animate-fade-in"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-divider)",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontWeight: 500,
            color: "var(--color-white)",
            marginBottom: 8,
            fontSize: 15,
          }}
        >
          Daily limit reached
        </div>
        <div
          style={{
            color: "var(--color-muted)",
            fontSize: 14,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          You've used your {FREE_LIMIT} free analyses for today. Upgrade for unlimited access.
        </div>
        <button
          onClick={onUpgradeClick}
          style={{
            width: "100%",
            padding: 14,
            background: "var(--color-accent)",
            border: "none",
            borderRadius: 8,
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Upgrade to Pro — $8/month
        </button>
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            fontSize: 12,
            color: "var(--color-muted)",
          }}
        >
          Limit resets at midnight
        </div>
      </div>
    )
  }

  if (remaining === FREE_LIMIT) return null // Full count — don't show until they've used one

  const pct = (remaining / FREE_LIMIT) * 100

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--color-muted)",
          marginBottom: 6,
        }}
      >
        <span>
          {remaining} of {FREE_LIMIT} free analyses remaining
        </span>
        <span>Resets at midnight</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 4,
          background: "var(--color-divider)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: remaining === 1 ? "var(--color-red)" : "var(--color-green)",
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  )
}
