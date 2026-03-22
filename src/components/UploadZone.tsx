import { useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onImageLoad: (base64: string, dataUrl: string) => void
  image: string | null
  onClear: () => void
  dragging: boolean
  setDragging: (v: boolean) => void
}

export default function UploadZone({
  onImageLoad,
  image,
  onClear,
  dragging,
  setDragging,
}: UploadZoneProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const b64 = dataUrl.split(",")[1]
        onImageLoad(b64, dataUrl)
      }
      reader.readAsDataURL(file)
    },
    [onImageLoad]
  )

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) processFile(file)
          break
        }
      }
    }
    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [processFile])

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
      }}
      onClick={() => !image && fileRef.current?.click()}
      className={cn(
        "relative w-full rounded-lg overflow-hidden transition-all duration-200",
        "border",
        image ? "border-transparent cursor-default" : "cursor-pointer",
        dragging
          ? "border-[var(--color-accent)] bg-[var(--color-card)]"
          : image
            ? "border-transparent"
            : "border-dashed border-[var(--color-divider)] bg-[var(--color-panel)]"
      )}
      style={{ minHeight: image ? "auto" : "180px" }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) processFile(file)
        }}
      />

      {image ? (
        <>
          <img
            src={image}
            alt="Uploaded chart"
            className="w-full block rounded-lg"
            style={{ maxHeight: "60vh", objectFit: "contain" }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className={cn(
              "absolute top-3 right-3",
              "w-8 h-8 rounded-full flex items-center justify-center",
              "bg-[var(--color-panel)] border border-[var(--color-divider)]",
              "text-[var(--color-muted)] text-sm",
              "hover:bg-[var(--color-card)] hover:text-[var(--color-white)] transition-colors"
            )}
            aria-label="Remove image"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-12 px-6 select-none">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: "var(--color-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
            </svg>
          </div>
          <div
            style={{
              fontWeight: 500,
              fontSize: 15,
              color: "var(--color-white)",
              marginBottom: 6,
            }}
          >
            Drop your chart screenshot here
          </div>
          <div style={{ fontSize: 13, color: "var(--color-muted)", textAlign: "center" }}>
            or click to browse · PNG, JPG · paste from clipboard
          </div>
        </div>
      )}
    </div>
  )
}
