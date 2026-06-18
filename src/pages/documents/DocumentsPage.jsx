import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle2,
  FileText,
  Files,
  Gauge,
  Presentation,
  RefreshCw,
  Upload,
} from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataTable } from "@/components/common/DataTable"
import { documentReviewPath } from "@/router/routes"
import { SAMPLE_DOCUMENTS, STATUS_META } from "@/pages/documents/sampleDocuments"

const FILE_ICONS = {
  pdf: FileText,
  pptx: Presentation,
  docx: FileText,
}

const ACCEPTED_EXTENSIONS = [".pdf", ".pptx", ".docx"]

function formatSize(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function DocumentsPage() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState(SAMPLE_DOCUMENTS)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)
  const timersRef = useRef([])

  // Clear any pending status-transition timers on unmount
  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const setDocStatus = (id, status) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
  }

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).filter((file) =>
      ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
    )
    if (files.length === 0) return

    const newDocs = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      type: file.name.split(".").pop().toLowerCase(),
      size: formatSize(file.size),
      engagement: "Unassigned",
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: "You",
      status: "PENDING",
      review: null,
    }))

    setDocs((prev) => [...newDocs, ...prev])

    // Simulate the ingestion pipeline: PENDING → PROCESSING → INGESTED
    newDocs.forEach((doc) => {
      timersRef.current.push(
        setTimeout(() => setDocStatus(doc.id, "PROCESSING"), 1500)
      )
      timersRef.current.push(
        setTimeout(() => setDocStatus(doc.id, "INGESTED"), 4000)
      )
    })
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    handleFiles(event.dataTransfer.files)
  }

  const totalCount = docs.length
  const ingestedCount = docs.filter((d) => d.status === "INGESTED").length
  const pipelineCount = docs.filter(
    (d) => d.status === "PROCESSING" || d.status === "PENDING"
  ).length
  const reviewedDocs = docs.filter((d) => d.review)
  const averageScore =
    reviewedDocs.length > 0
      ? Math.round(
          reviewedDocs.reduce((sum, d) => sum + d.review.overallScore, 0) /
            reviewedDocs.length
        )
      : null

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row) => {
        const Icon = FILE_ICONS[row.type] ?? FileText
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EDE9F8]">
              <Icon className="size-4 text-[#3B1F6A]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate max-w-[26rem]">
                {row.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.type.toUpperCase()} · {row.size}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: "engagement",
      header: "Engagement",
      render: (row) => (
        <span className="text-sm text-muted-foreground">{row.engagement}</span>
      ),
    },
    {
      key: "uploadedAt",
      header: "Uploaded",
      render: (row) => (
        <div>
          <p className="text-sm text-foreground">{row.uploadedAt}</p>
          <p className="text-xs text-muted-foreground">by {row.uploadedBy}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const meta = STATUS_META[row.status] ?? STATUS_META.PENDING
        return (
          <StatusBadge tone={meta.tone} withDot={meta.withDot}>
            {meta.label}
          </StatusBadge>
        )
      },
    },
    {
      key: "score",
      header: "Quality Score",
      render: (row) => {
        if (row.review) {
          return (
            <span className="text-sm font-semibold text-[#3B1F6A]">
              {row.review.overallScore} / 100
            </span>
          )
        }
        if (row.status === "INGESTED") {
          return (
            <span className="text-xs text-muted-foreground">
              Queued for review
            </span>
          )
        }
        return <span className="text-sm text-muted-foreground">—</span>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Library"
        description="Upload final deliverables and review them against the firm's Quality Standards."
        badge={`${totalCount} Documents`}
      />

      <PreviewBanner>
        The document ingestion and review API is under development — this module
        previews the full workflow with sample data.
      </PreviewBanner>

      {/* Upload dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-[#7B3FBE] bg-[#F7F4FC]"
            : "border-[#C4B0E8] bg-card hover:bg-[#F7F4FC]"
        }`}
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#EDE9F8]">
          <Upload className="size-5 text-[#7B3FBE]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Drop your final work here or{" "}
            <span className="text-[#7B3FBE] underline underline-offset-2">
              browse
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, PPTX or DOCX — deliverables are queued for an automated quality
            review on upload
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.pptx,.docx"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Documents"
          value={totalCount}
          hint="Across all engagements"
          icon={Files}
          tone="purple"
        />
        <StatCard
          label="Ingested"
          value={ingestedCount}
          hint="Available for quality review"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Processing"
          value={pipelineCount}
          icon={RefreshCw}
          tone="warning"
        >
          <StatusBadge tone="warning" withDot className="self-start">
            {pipelineCount > 0 ? "Pipeline active" : "Pipeline idle"}
          </StatusBadge>
        </StatCard>
        <StatCard
          label="Average Quality Score"
          value={averageScore !== null ? `${averageScore} / 100` : "—"}
          hint={`${reviewedDocs.length} reviewed document${reviewedDocs.length === 1 ? "" : "s"}`}
          icon={Gauge}
          tone="info"
        />
      </div>

      {/* Documents table */}
      <DataTable
        columns={columns}
        rows={docs}
        onRowClick={(row) => navigate(documentReviewPath(row.id))}
        footer={
          <span className="text-xs text-muted-foreground">
            Showing {totalCount} documents · click a row to open its quality
            review
          </span>
        }
      />
    </div>
  )
}
