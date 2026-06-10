import { useEffect, useRef, useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bot,
  Send,
  FileText,
  FileUp,
  Scissors,
  Database,
  MessageSquareText,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Sample data — the retrieval endpoint does not exist yet (preview module).
// Assistant messages carry structured "blocks" plus cited sources.
// ---------------------------------------------------------------------------

const SAMPLE_THREAD = [
  {
    id: "m-1",
    role: "user",
    text: "What documentation are we required to retain when accepting a new audit client, and for how long?",
  },
  {
    id: "m-2",
    role: "assistant",
    blocks: [
      {
        type: "p",
        text: "Under ISQM 1 ¶30 and the firm's Acceptance & Continuance policy, the engagement file must evidence how the firm concluded it can perform the engagement in accordance with professional standards. For a new audit client, the following must be on file before the engagement letter is signed:",
      },
      { type: "heading", text: "Required documentation" },
      {
        type: "list",
        items: [
          "Completed client acceptance questionnaire (Form A&C-01), approved by the engagement partner and a second reviewing partner",
          "Client integrity screening — background checks on the entity, its owners and key management, including sanctions and PEP list results",
          "Independence and conflict-of-interest confirmations for every proposed team member",
          "Assessment of competence and capacity — expertise, time and resources required to perform the engagement",
          "Communication with the predecessor auditor, where applicable, and the response received",
        ],
      },
      {
        type: "p",
        text: "These records are retained for 10 years from the date of the engagement report, in line with the firm's records retention schedule (section 7.2 of the Quality Standards Manual).",
      },
    ],
    sources: [
      { label: "Quality Standards Manual", ref: "p. 12", relevance: 94 },
      { label: "ISQM 1", ref: "¶30", relevance: 91 },
      { label: "A&C Policy GT-DZ-2025", ref: "p. 4", relevance: 86 },
    ],
  },
]

const CANNED_REPLY = {
  role: "assistant",
  blocks: [
    {
      type: "p",
      text: "This preview isn't connected to the retrieval service yet, so I can't ground an answer in the firm's Quality Standards library. Once document ingestion ships, asking this question will:",
    },
    {
      type: "list",
      items: [
        "Search the indexed Quality Standards Manual, ISQM 1 policies and SOQM procedures",
        "Return a grounded answer with page-level citations and relevance scores",
        "Flag anything outside the indexed library instead of guessing",
      ],
    },
    {
      type: "p",
      text: "The exchange above illustrates the experience you can expect once the backend is live.",
    },
  ],
  sources: [],
}

const SUGGESTED_PROMPTS = [
  "What does ISQM 1 require for engagement quality reviews?",
  "Summarise the firm's independence confirmation process.",
  "When must a root cause analysis be performed for findings?",
  "Which components require annual monitoring activities?",
]

const HOW_IT_WORKS = [
  {
    title: "Upload standards",
    description: "Quality manuals and policies are uploaded to the document library.",
    icon: FileUp,
  },
  {
    title: "Parsing & chunking",
    description: "Each document is parsed and split into small, citable passages.",
    icon: Scissors,
  },
  {
    title: "Vector retrieval",
    description: "Your question is matched against passage embeddings to find the most relevant excerpts.",
    icon: Database,
  },
  {
    title: "Grounded answer",
    description: "The assistant answers strictly from retrieved passages, with sources and relevance scores.",
    icon: MessageSquareText,
  },
]

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function AssistantAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EDE9F8]">
      <Bot className="size-4 text-[#7B3FBE]" />
    </div>
  )
}

function MessageBlocks({ blocks }) {
  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <p key={i} className="text-[13px] font-semibold text-[#1E0A3C] pt-0.5">
              {block.text}
            </p>
          )
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2 text-sm leading-relaxed text-[#3D3654]">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#7B3FBE]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-[#3D3654]">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

function SourceChips({ sources }) {
  if (!sources?.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mr-1">
        Sources
      </span>
      {sources.map((source) => (
        <span
          key={`${source.label}-${source.ref}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E3D9F5] bg-[#F7F4FC] px-2.5 py-1 text-[11px] text-[#4A3D6A]"
        >
          <FileText className="size-3 text-[#7B3FBE]" />
          {source.label} · {source.ref}
          <span className="font-semibold text-[#7B3FBE]">{source.relevance}%</span>
        </span>
      ))}
    </div>
  )
}

function ChatMessage({ message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#3B1F6A] px-4 py-2.5 text-sm leading-relaxed text-white">
          {message.text}
        </div>
      </div>
    )
  }
  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div className="max-w-[85%] space-y-2.5 min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          SOQM Assistant
        </span>
        <div className="rounded-2xl rounded-tl-sm bg-[#F7F4FC] px-4 py-3">
          <MessageBlocks blocks={message.blocks} />
        </div>
        <SourceChips sources={message.sources} />
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-[#F7F4FC] px-4 py-3.5">
        <span className="size-1.5 rounded-full bg-[#7B3FBE]/70 animate-bounce" />
        <span className="size-1.5 rounded-full bg-[#7B3FBE]/70 animate-bounce [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-[#7B3FBE]/70 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChatbotPage() {
  const [messages, setMessages] = useState(SAMPLE_THREAD)
  const [draft, setDraft] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const threadRef = useRef(null)
  const replyTimeoutRef = useRef(null)

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, isTyping])

  useEffect(() => () => clearTimeout(replyTimeoutRef.current), [])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ])
    setDraft("")
    setIsTyping(true)
    replyTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { ...CANNED_REPLY, id: `a-${Date.now()}` }])
      setIsTyping(false)
    }, 1100)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(draft)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SOQM Chatbot"
        description="Ask questions about the firm's Quality Standards and ISQM 1 requirements."
        badge="RAG Assistant"
      />

      <PreviewBanner>
        The retrieval API is not connected yet — responses below are sample
        exchanges illustrating the assistant.
      </PreviewBanner>

      <div className="grid gap-4 items-start xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* Chat panel */}
        <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-border bg-white">

          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <AssistantAvatar />
              <div>
                <p className="text-sm font-medium text-[#1E0A3C]">
                  Quality Standards Assistant
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Grounded Q&A over the firm's SOQM library
                </p>
              </div>
            </div>
            <StatusBadge tone="purple" withDot>
              Preview
            </StatusBadge>
          </div>

          {/* Thread */}
          <div ref={threadRef} className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Suggested prompts + composer */}
          <div className="space-y-3 border-t border-border px-4 pt-3 pb-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isTyping}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-[#E3D9F5] bg-[#F7F4FC] px-3 py-1.5 text-xs text-[#3B1F6A] transition-colors hover:border-[#C4B0E8] hover:bg-[#EDE9F8] disabled:pointer-events-none disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about the firm's Quality Standards…"
                aria-label="Message the SOQM Assistant"
              />
              <Button
                type="submit"
                disabled={!draft.trim() || isTyping}
                className="bg-[#3B1F6A] hover:bg-[#52298F] text-white"
              >
                <Send className="size-4" />
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Right rail — xl screens only */}
        <aside className="hidden xl:block space-y-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              How it works
            </p>
            <div className="mt-4">
              {HOW_IT_WORKS.map((step, index) => (
                <div key={step.title}>
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EDE9F8] text-[11px] font-semibold text-[#3B1F6A]">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <step.icon className="size-3.5 text-[#7B3FBE]" />
                        <p className="text-sm font-medium text-[#1E0A3C]">
                          {step.title}
                        </p>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="ml-3 my-1.5 h-4 w-px bg-border" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
              Answers are grounded in the firm's own library — the assistant
              never cites material that hasn't been ingested.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
