import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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
          {resumes.map((resume) => (
            <li key={resume.id}>
              <a href={`/resumes/${resume.id}`}>
                {resume.rawText.slice(0, 60)}
                {resume.rawText.length > 60 ? "…" : ""}
              </a>
              {" — "}
              <a href={`/resumes/${resume.id}/tailor`}>Tailor</a>
            </li>
          ))}
        </ul>
      )}
      <p>
        <a href="/upload">Upload another resume</a>
      </p>
    </main>
  )
}
