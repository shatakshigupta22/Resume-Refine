# ResumeRefine

AI-powered resume tailoring app. The goal is three real engineering features, not a thin wrapper around one API call.

## Stack
- Next.js 14 (App Router, TypeScript)
- Prisma + PostgreSQL (Neon)
- Claude API (Anthropic) — Haiku for dev/testing, Sonnet for real runs
- Auth: email/password or magic link (not Google OAuth — avoids the unverified app screen for a small user base)
- Deploy: Vercel

## Schema (Prisma)

```prisma
model User {
  id      String   @id @default(cuid())
  email   String   @unique
  resumes Resume[]
}

model Resume {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  rawText    String
  tailorings TailorJob[]
}

model TailorJob {
  id             String   @id @default(cuid())
  resumeId       String
  resume         Resume   @relation(fields: [resumeId], references: [id])
  jobDescription String
  tailoredOutput String?
  criticScore    Int?
  loopsRun       Int      @default(0)
}
```

## The three core features (in build order)

1. **OCR fallback** — normal text parsing first. If parsing fails or output looks like garbage (define: too short, bad word/char ratio, missing expected resume sections), route the PDF to Claude's vision endpoint instead.
2. **MCP server** — a real MCP server backed by a Postgres table of standardized tech skills. Claude queries it dynamically during tailoring instead of a giant skills list stuffed into the prompt.
3. **Multi-agent critic loop** — Agent A drafts tailored bullets. Agent B (recruiter persona) scores against the job description out of 100. Below threshold → feedback loops back to Agent A. Hard iteration cap. Fallback: return best-scoring attempt if the cap is hit without clearing the bar.

## Build order
1. Scaffold: Next.js 14 + Prisma + Neon Postgres + auth
2. Resume upload + text parsing
3. OCR fallback (Claude vision)
4. MCP server + skills table, wired into tailoring
5. Agent A (drafts), tested end to end
6. Agent B (critic/scorer)
7. Wire the loop, add hard cap
8. Error handling, edge cases, UI cleanup
9. Deploy + feedback pass

## Ownership split — read this before starting a session

This is a portfolio/interview project. The point is not just working code — it's code I can defend cold, whiteboard-style, in an interview. Split accordingly:

**I write the core logic myself, Claude Code assists/reviews:**
- The garbage-detection heuristic that triggers OCR fallback
- The critic loop's scoring interpretation, retry condition, and cap/fallback logic
- The MCP server's query design (what it exposes, how tailoring calls it)

For these three, start in plan mode, read the plan, and if Claude Code proposes the actual implementation, I rewrite or substantially rework it myself rather than accepting the first draft. I should be able to explain *why* each of these three works the way it does, not just that it works.

**Claude Code owns fully:**
- Prisma schema wiring, migrations
- Next.js routing, layouts, UI components
- Auth setup (magic link / email-password)
- CRUD endpoints
- Deployment config

## Workflow rules
- Plan mode first for any new feature. Read the plan before code gets written.
- Read every diff before accepting.
- One feature per session where possible — keeps Pro plan usage limits mostly invisible and keeps commits meaningful.
- Commit incrementally per feature (not one big dump at the end) — the commit history should read as real build process.
- End of each of the three core features: close the laptop, explain it out loud with no notes. If I can't, go back in before moving to the next feature.
- Keep a one-paragraph daily log: what got built, what alternative was considered, why this approach won. (This doubles as interview prep.)

## Environment
- `DATABASE_URL` — Neon connection string
- `ANTHROPIC_API_KEY` — Console API key with spending cap set, used only in `.env.local` for app calls. Do NOT export this in shell profile — Claude Code in the same terminal will pick it up and bill API instead of the Pro subscription.
- Use Haiku model during dev/testing, switch to Sonnet for final demo runs, to control cost.
