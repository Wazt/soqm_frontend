// Sample data for the Documents preview module (list + review pages).
// Mirrors the planned document-ingestion API response shapes (pydantic models):
// Document { id, name, type, size, engagement, uploaded_at/by, status, review? }
// Review   { overall_score, verdict, reviewer, reviewed_at, criteria[], findings[], sources[] }
// Lifecycle statuses: PENDING → PROCESSING → INGESTED (then ARCHIVED), or FAILED.

export const STATUS_META = {
  PENDING: { tone: "muted", label: "Pending", withDot: false },
  PROCESSING: { tone: "warning", label: "Processing", withDot: true },
  INGESTED: { tone: "success", label: "Ingested", withDot: false },
  ARCHIVED: { tone: "muted", label: "Archived", withDot: false },
  FAILED: { tone: "danger", label: "Failed", withDot: false },
}

export const SAMPLE_DOCUMENTS = [
  {
    id: "doc-001",
    name: "Statutory Audit Report — Cevital SPA FY2025.pdf",
    type: "pdf",
    size: "4.6 MB",
    engagement: "Statutory Audit — Cevital SPA 2025",
    uploadedAt: "2026-05-28",
    uploadedBy: "Amina Benkhelifa",
    status: "INGESTED",
    review: {
      overallScore: 86,
      verdict: "Meets firm quality standards with minor observations",
      reviewer: "Gemini · Quality Reviewer v0",
      reviewedAt: "2026-05-28",
      criteria: [
        {
          name: "Alignment with Quality Standards",
          score: 90,
          assessment:
            "The report structure follows the firm's audit reporting template and references the applicable ISA framework throughout.",
        },
        {
          name: "Completeness of Documentation",
          score: 84,
          assessment:
            "Key audit matters are fully documented, though two appendices referenced in the opinion section are not included in the file.",
        },
        {
          name: "Methodology Compliance",
          score: 88,
          assessment:
            "Materiality thresholds and the sampling approach match the firm's audit methodology for large industrial groups.",
        },
        {
          name: "Clarity and Structure",
          score: 85,
          assessment:
            "Sections are well ordered with consistent numbering; some tables in the findings annex lack captions.",
        },
        {
          name: "Risk Coverage",
          score: 81,
          assessment:
            "Going-concern and revenue-recognition risks are addressed in depth; IT general controls coverage is comparatively thin.",
        },
      ],
      findings: [
        {
          id: "f-001-1",
          severity: "MEDIUM",
          title: "Appendices referenced in the opinion section are missing",
          detail:
            "Appendices C and D (group scoping memorandum and component auditor instructions) are cited on pages 12 and 31 but are absent from the deliverable.",
          component: "Engagement Performance",
          recommendation:
            "Attach the referenced appendices or remove the citations before the engagement file is archived.",
          source: "Quality Standards Manual v4 · p. 87",
        },
        {
          id: "f-001-2",
          severity: "MEDIUM",
          title: "IT general controls risk discussion is limited",
          detail:
            "ITGC reliance is asserted for the revenue cycle, but the report devotes a single paragraph to ITGC testing outcomes.",
          component: "Firm's Risk Assessment Process",
          recommendation:
            "Expand the ITGC section to cover access management and change management conclusions.",
          source: "ISQM 1 Implementation Handbook · p. 142",
        },
        {
          id: "f-001-3",
          severity: "LOW",
          title: "Findings annex tables lack captions and cross-references",
          detail:
            "Tables 4 through 9 in the findings annex carry no numbered captions, making the narrative cross-references ambiguous.",
          component: "Information and Communication",
          recommendation:
            "Add numbered captions to tables 4–9 and reference them explicitly from the findings narrative.",
          source: "Audit Documentation Guide 2026 · p. 23",
        },
      ],
      sources: [
        {
          document: "Quality Standards Manual v4",
          page: 87,
          relevance: 94,
          snippet:
            "Final deliverables shall include every appendix referenced in the body of the report; all cross-references must resolve within the archived engagement file.",
        },
        {
          document: "ISQM 1 Implementation Handbook",
          page: 142,
          relevance: 87,
          snippet:
            "Where reliance is placed on IT general controls, the engagement report must summarise the testing of access management, change management and computer operations.",
        },
        {
          document: "Audit Documentation Guide 2026",
          page: 23,
          relevance: 71,
          snippet:
            "Tables and exhibits included in annexes carry sequential captions and are referenced at least once from the main narrative.",
        },
      ],
    },
  },
  {
    id: "doc-002",
    name: "Consolidated Financial Statements — Groupe Saidal FY2025.pdf",
    type: "pdf",
    size: "8.2 MB",
    engagement: "Statutory Audit — Groupe Saidal 2025",
    uploadedAt: "2026-04-14",
    uploadedBy: "Karim Haddad",
    status: "INGESTED",
    review: {
      overallScore: 91,
      verdict: "Exceeds firm quality standards — ready for partner sign-off",
      reviewer: "Gemini · Quality Reviewer v0",
      reviewedAt: "2026-04-15",
      criteria: [
        {
          name: "Alignment with Quality Standards",
          score: 94,
          assessment:
            "Fully aligned with the firm's consolidated reporting standards and IAS 1 presentation requirements.",
        },
        {
          name: "Completeness of Documentation",
          score: 90,
          assessment:
            "All required notes, supporting schedules and the group structure annex are present and internally consistent.",
        },
        {
          name: "Methodology Compliance",
          score: 92,
          assessment:
            "Consolidation eliminations and segment disclosures follow the group audit methodology without deviation.",
        },
        {
          name: "Clarity and Structure",
          score: 93,
          assessment:
            "Clean layout with consistent terminology across the primary statements and the accompanying notes.",
        },
        {
          name: "Risk Coverage",
          score: 86,
          assessment:
            "Pharmaceutical inventory obsolescence risk is well covered; foreign-currency exposure notes could go deeper.",
        },
      ],
      findings: [
        {
          id: "f-002-1",
          severity: "LOW",
          title: "Foreign-currency sensitivity note lacks scenario detail",
          detail:
            "Note 28 discloses DZD/EUR exposure qualitatively but omits the two-scenario sensitivity table recommended by the disclosure checklist.",
          component: "Engagement Performance",
          recommendation:
            "Add a two-scenario DZD/EUR sensitivity table to note 28 before the statements are filed.",
          source: "IFRS Disclosure Checklist 2026 · p. 64",
        },
      ],
      sources: [
        {
          document: "Quality Standards Manual v4",
          page: 64,
          relevance: 91,
          snippet:
            "Consolidated deliverables are assessed against the group reporting template, including completeness of the group structure annex and intercompany elimination schedules.",
        },
        {
          document: "IFRS Disclosure Checklist 2026",
          page: 64,
          relevance: 89,
          snippet:
            "Entities with material foreign-currency exposure present a sensitivity analysis covering at least two plausible exchange-rate scenarios.",
        },
        {
          document: "GT Group Audit Methodology",
          page: 33,
          relevance: 78,
          snippet:
            "Segment disclosures are reconciled to the consolidation working papers and reviewed for consistency with the management report.",
        },
      ],
    },
  },
  {
    id: "doc-003",
    name: "Audit Committee Closing Presentation — Sonatrach Refining.pptx",
    type: "pptx",
    size: "12.4 MB",
    engagement: "Statutory Audit — Sonatrach Refining 2025",
    uploadedAt: "2026-05-12",
    uploadedBy: "Sofia Mansouri",
    status: "INGESTED",
    review: {
      overallScore: 73,
      verdict: "Partially meets firm quality standards — remediation recommended before release",
      reviewer: "Gemini · Quality Reviewer v0",
      reviewedAt: "2026-05-13",
      criteria: [
        {
          name: "Alignment with Quality Standards",
          score: 78,
          assessment:
            "The deck follows the audit committee template but omits the mandatory quality-review sign-off slide.",
        },
        {
          name: "Completeness of Documentation",
          score: 66,
          assessment:
            "The summary of uncorrected misstatements lacks the quantitative materiality bridge required by the firm.",
        },
        {
          name: "Methodology Compliance",
          score: 75,
          assessment:
            "Sampling conclusions are summarised correctly, though reliance on prior-year controls testing is not flagged.",
        },
        {
          name: "Clarity and Structure",
          score: 82,
          assessment:
            "Visual hierarchy is strong; slide pacing and headline messages communicate the conclusions effectively.",
        },
        {
          name: "Risk Coverage",
          score: 64,
          assessment:
            "Refining margin volatility and sanctions-related counterparty risks receive only a single slide of coverage.",
        },
      ],
      findings: [
        {
          id: "f-003-1",
          severity: "HIGH",
          title: "Uncorrected misstatement summary omits materiality thresholds",
          detail:
            "Slide 14 lists six uncorrected items without comparing them to overall and performance materiality, contrary to the firm's reporting standard.",
          component: "Engagement Performance",
          recommendation:
            "Insert the materiality bridge table from the closing memorandum and re-issue the deck.",
          source: "Quality Standards Manual v4 · p. 102",
        },
        {
          id: "f-003-2",
          severity: "MEDIUM",
          title: "Independence confirmation slide references the 2024 declaration cycle",
          detail:
            "Slide 3 cites the annual independence confirmations collected in 2024 instead of the current 2026 cycle.",
          component: "Relevant Ethical Requirements",
          recommendation:
            "Update slide 3 with the 2026 annual independence confirmation reference before the committee meeting.",
          source: "Ethics & Independence Policy v7 · p. 18",
        },
        {
          id: "f-003-3",
          severity: "LOW",
          title: "Mandatory EQR sign-off slide missing from the appendix",
          detail:
            "The standard engagement quality review sign-off slide is absent from the appendix section of the deck.",
          component: "Governance and Leadership",
          recommendation:
            "Append the standard EQR sign-off slide from the 2026 committee reporting template.",
          source: "Audit Committee Reporting Template 2026 · p. 6",
        },
      ],
      sources: [
        {
          document: "Quality Standards Manual v4",
          page: 102,
          relevance: 96,
          snippet:
            "Communications of uncorrected misstatements to those charged with governance shall present each item against overall materiality and performance materiality.",
        },
        {
          document: "Ethics & Independence Policy v7",
          page: 18,
          relevance: 85,
          snippet:
            "All governance communications reference the independence confirmations of the current declaration cycle, including those of component teams.",
        },
        {
          document: "Audit Committee Reporting Template 2026",
          page: 6,
          relevance: 74,
          snippet:
            "The closing deck appendix includes the engagement quality reviewer's sign-off slide confirming completion of the EQR procedures.",
        },
      ],
    },
  },
  {
    id: "doc-004",
    name: "Engagement Completion Memorandum — Air Algérie ICFR.docx",
    type: "docx",
    size: "1.1 MB",
    engagement: "Internal Controls Review — Air Algérie 2025",
    uploadedAt: "2026-05-30",
    uploadedBy: "Yacine Brahimi",
    status: "INGESTED",
    review: {
      overallScore: 58,
      verdict: "Below firm quality standards — escalation to the quality review board required",
      reviewer: "Gemini · Quality Reviewer v0",
      reviewedAt: "2026-05-31",
      criteria: [
        {
          name: "Alignment with Quality Standards",
          score: 62,
          assessment:
            "The memorandum deviates from the firm's completion template in four of the nine mandatory sections.",
        },
        {
          name: "Completeness of Documentation",
          score: 48,
          assessment:
            "The client continuance reassessment, EQR concurrence and the consultation log are missing entirely.",
        },
        {
          name: "Methodology Compliance",
          score: 60,
          assessment:
            "Deficiency severity ratings are asserted without the supporting aggregation analysis required by the methodology.",
        },
        {
          name: "Clarity and Structure",
          score: 71,
          assessment:
            "Writing is readable, but conclusions are scattered across sections rather than consolidated in the summary.",
        },
        {
          name: "Risk Coverage",
          score: 49,
          assessment:
            "There is no linkage between the identified control deficiencies and the financial statement assertions they affect.",
        },
      ],
      findings: [
        {
          id: "f-004-1",
          severity: "HIGH",
          title: "Client continuance reassessment not documented",
          detail:
            "The engagement scope was extended in March 2026, yet no updated acceptance and continuance evaluation is included in the file.",
          component:
            "Acceptance and Continuance of Client Relationships and Specific Engagements",
          recommendation:
            "Complete the continuance questionnaire and obtain partner approval before the file is archived.",
          source: "Quality Standards Manual v4 · p. 41",
        },
        {
          id: "f-004-2",
          severity: "HIGH",
          title: "Significant deficiencies lack remediation owners and target dates",
          detail:
            "The five significant deficiencies reported to management carry no named remediation owner and no target resolution date.",
          component: "Monitoring and Remediation Process",
          recommendation:
            "Assign a named owner and a remediation deadline to each significant deficiency in section 7.",
          source: "ISQM 1 Implementation Handbook · p. 156",
        },
        {
          id: "f-004-3",
          severity: "MEDIUM",
          title: "Consultation with the IT audit specialist is referenced but not logged",
          detail:
            "Section 6 refers to a consultation with the IT audit team on access controls, but no consultation memorandum is attached.",
          component: "Resources",
          recommendation:
            "Attach the consultation memorandum from the IT audit team and record it in the consultation log.",
          source: "Consultation Policy 2026 · p. 9",
        },
      ],
      sources: [
        {
          document: "Quality Standards Manual v4",
          page: 41,
          relevance: 95,
          snippet:
            "A change in the nature or scope of an engagement triggers a reassessment of the acceptance and continuance conclusion, approved by the engagement partner.",
        },
        {
          document: "ISQM 1 Implementation Handbook",
          page: 156,
          relevance: 90,
          snippet:
            "Remediation of identified deficiencies is assigned to individuals with appropriate authority, with defined target dates and follow-up monitoring.",
        },
        {
          document: "Consultation Policy 2026",
          page: 9,
          relevance: 82,
          snippet:
            "Consultations on difficult or contentious matters are documented in a memorandum agreed by both the consulting and the engagement team.",
        },
      ],
    },
  },
  {
    id: "doc-005",
    name: "Going Concern Assessment Memo — Biopharm SPA.docx",
    type: "docx",
    size: "860 KB",
    engagement: "Due Diligence — Biopharm SPA Acquisition",
    uploadedAt: "2026-06-09",
    uploadedBy: "Elena Petrova",
    status: "PROCESSING",
    review: null,
  },
  {
    id: "doc-006",
    name: "Interim Review Findings — Condor Electronics H1.pptx",
    type: "pptx",
    size: "18.9 MB",
    engagement: "IFRS Interim Review — Condor Electronics 2026",
    uploadedAt: "2026-06-02",
    uploadedBy: "James Whitfield",
    status: "FAILED",
    review: null,
  },
  {
    id: "doc-007",
    name: "Statutory Audit Report — Danone Djurdjura FY2024.pdf",
    type: "pdf",
    size: "3.9 MB",
    engagement: "Statutory Audit — Danone Djurdjura Algérie 2024",
    uploadedAt: "2026-01-19",
    uploadedBy: "Nadia Cherif",
    status: "ARCHIVED",
    review: null,
  },
]
