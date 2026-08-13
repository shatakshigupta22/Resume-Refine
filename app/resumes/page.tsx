import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

function extractDisplayName(rawText: string): string | null {
  const firstLine = rawText.split("\n")[0]?.trim()
  if (!firstLine) return null

  const words = firstLine
    .replace(/\b(resume|cv|résumé|curriculum vitae)\b/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length < 2 || words.length > 4) return null
  if (words.some((word) => !/^[A-Z][a-zA-Z'.-]*$/.test(word))) return null
  if (words.join(" ").length > 40) return null

  return words.join(" ")
}

export default async function ResumesIndexPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { id: "desc" },
  })

  return (
    <main className="page">
      <h1>Your resumes</h1>
      {resumes.length === 0 ? (
        <p>
          No resumes uploaded yet. <a href="/upload">Upload one</a>.
        </p>
      ) : (
        <ul className="resume-list">
          {resumes.map((resume) => {
            const label = extractDisplayName(resume.rawText) ?? `Resume #${resume.id.slice(-6)}`
            return (
              <li key={resume.id} className="card">
                <a href={`/resumes/${resume.id}`} className="resume-card-title">
                  {label}
                </a>
                <span>
                  <a href={`/resumes/${resume.id}`}>View</a>
                  {" · "}
                  <a href={`/resumes/${resume.id}/tailor`}>Tailor for a job</a>
                  {" · "}
                  <a href={`/resumes/${resume.id}/check`}>Fit check</a>
                </span>
              </li>
            )
          })}
        </ul>
      )}
      <p>
        <a href="/upload">Upload another resume</a>
      </p>
    </main>
  )
}
