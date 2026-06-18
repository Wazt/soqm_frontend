import { Link, useParams } from "react-router-dom"
import {
  Archive,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CornerDownRight,
  FileQuestion,
  FileX2,
  Hourglass,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatusBadge } from "@/components/common/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { ROUTES } from "@/router/routes"
import { SAMPLE_DOCUMENTS, STATUS_META } from "@/pages/documents/sampleDocuments"

const SEVERITY_META = {
  HIGH: { tone: "danger", label: "High" },
  MEDIUM: { tone: "warning", label: "Medium" },
  LOW: { tone: "info", label: "Low" },
}

// Score → tint: ≥80 success-ish, 60–79 warning, <60 danger
function scoreTone(score) {
  if (score >= 80) return { text: "text-[#1A4731]", bar: "bg-[#2E7D52]" }
  if (score >= 60) return { text: "text-[#7A3E0A]", bar: "bg-[#D4820A]" }
  return { text: "text-[#7A1E3E]", bar: "bg-[#C4336E]" }
}

function BackLink() {
  return (
    <Link
      to={ROUTES.DOCUMENTS}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7B3FBE] hover:text-[#52298F] transition-colors"
    >
      <ArrowLeft className="size-4" />
      Document Library
    </Link>
  )
}

function SectionTitle({ children, count }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </h2>
      {count !== undefined && (
        <span className="text-[11px] font-medium bg-[#EDE9F8] text-[#3B1F6A] px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  )
}

const UNAVAILABLE_META = {
  PENDING: {
    icon: Hourglass,
    description:
      "The document is still being processed by the ingestion pipeline. The quality review will appear here once ingestion completes.",
  },
  PROCESSING: {
    icon: Hourglass,
    description:
      "The document is still being processed by the ingestion pipeline. The quality review will appear here once ingestion completes.",
  },
  FAILED: {
    icon: FileX2,
    description:
      "Ingestion failed for this document. Re-upload it from the Document Library to trigger a new quality review.",
  },
  ARCHIVED: {
    icon: Archive,
    description:
      "This document was archived without an automated quality review on record.",
  },
}

export default function DocumentReviewPage() {
  const { documentId } = useParams()
  const doc = SAMPLE_DOCUMENTS.find((d) => d.id === documentId)

  if (!doc) {
    return (
      <div className="space-y-6">
        <BackLink />
        <EmptyState
          icon={FileQuestion}
          title="Document not found"
          description="No document with this reference exists in the library. It may have been removed or the link is out of date."
          action={
            <Link
              to={ROUTES.DOCUMENTS}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#3B1F6A] hover:bg-[#52298F] px-3 text-sm font-medium text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Document Library
            </Link>
          }
        />
      </div>
    )
  }

  const statusMeta = STATUS_META[doc.status] ?? STATUS_META.PENDING
  const review = doc.status === "INGESTED" ? doc.review : null

  return (
    <div className="space-y-6">
      <BackLink />

      <PageHeader
        title={doc.name}
        description={`${doc.engagement} · Uploaded ${doc.uploadedAt} · ${doc.size}`}
        actions={
          <StatusBadge tone={statusMeta.tone} withDot={statusMeta.withDot}>
            {statusMeta.label}
          </StatusBadge>
        }
      />

      <PreviewBanner>
        The document ingestion and review API is under development — this
        quality review is rendered from sample data.
      </PreviewBanner>

      {!review ? (
        <EmptyState
          icon={(UNAVAILABLE_META[doc.status] ?? UNAVAILABLE_META.PENDING).icon}
          title="Review not available yet"
          description={
            (UNAVAILABLE_META[doc.status] ?? UNAVAILABLE_META.PENDING)
              .description
          }
          action={
            <Link
              to={ROUTES.DOCUMENTS}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#3B1F6A] hover:bg-[#52298F] px-3 text-sm font-medium text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Document Library
            </Link>
          }
        />
      ) : (
        <>
          {/* Verdict card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-[#F7F4FC] px-8 py-5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Overall Score
                </span>
                <div className="mt-1 flex items-end gap-1">
                  <span className="text-5xl font-semibold tracking-tight text-foreground">
                    {review.overallScore}
                  </span>
                  <span className="pb-1.5 text-base text-muted-foreground">
                    /100
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-base font-medium leading-snug text-foreground">
                  {review.verdict}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9F8] px-2.5 py-1 text-[11px] font-medium text-[#3B1F6A]">
                    <Sparkles className="size-3" />
                    {review.reviewer}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    Reviewed {review.reviewedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Criteria breakdown */}
          <section className="space-y-3">
            <SectionTitle>Criteria Breakdown</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {review.criteria.map((criterion) => {
                const tone = scoreTone(criterion.score)
                return (
                  <div
                    key={criterion.name}
                    className="space-y-3 rounded-xl border border-border bg-card p-5 hover:border-[#C4B0E8] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium leading-snug text-foreground">
                        {criterion.name}
                      </h3>
                      <span className={`text-sm font-semibold ${tone.text}`}>
                        {criterion.score}
                        <span className="font-normal text-muted-foreground">
                          /100
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F1EDFA]">
                      <div
                        className={`h-full rounded-full ${tone.bar}`}
                        style={{ width: `${criterion.score}%` }}
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {criterion.assessment}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Findings */}
          <section className="space-y-3">
            <SectionTitle count={review.findings.length}>Findings</SectionTitle>
            <div className="space-y-4">
              {review.findings.map((finding) => {
                const severity =
                  SEVERITY_META[finding.severity] ?? SEVERITY_META.LOW
                return (
                  <div
                    key={finding.id}
                    className="space-y-3 rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={severity.tone}>
                        {severity.label}
                      </StatusBadge>
                      <h3 className="text-sm font-medium text-foreground">
                        {finding.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {finding.detail}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9F8] px-2.5 py-1 text-[11px] font-medium text-[#3B1F6A]">
                      <ShieldCheck className="size-3" />
                      {finding.component}
                    </span>
                    <div className="flex items-start gap-2">
                      <CornerDownRight className="mt-0.5 size-3.5 shrink-0 text-[#7B3FBE]" />
                      <p className="text-[13px] leading-relaxed text-foreground">
                        <span className="font-medium">Recommendation: </span>
                        {finding.recommendation}
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="size-3.5" />
                      {finding.source}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Sources consulted */}
          <section className="space-y-3">
            <SectionTitle count={review.sources.length}>
              Sources Consulted
            </SectionTitle>
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              <div className="px-5 py-4">
                <p className="text-sm font-medium text-foreground">
                  Retrieved passages
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Knowledge-base chunks the reviewer consulted, ranked by
                  relevance.
                </p>
              </div>
              {review.sources.map((source) => (
                <div
                  key={`${source.document}-${source.page}`}
                  className="space-y-2 px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {source.document}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        p. {source.page}
                      </span>
                    </p>
                    <span className="text-xs font-semibold text-[#3B1F6A]">
                      {source.relevance}% relevant
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#F1EDFA]">
                    <div
                      className="h-full rounded-full bg-[#7B3FBE]"
                      style={{ width: `${source.relevance}%` }}
                    />
                  </div>
                  <p className="text-[13px] italic leading-relaxed text-muted-foreground">
                    “{source.snippet}”
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
