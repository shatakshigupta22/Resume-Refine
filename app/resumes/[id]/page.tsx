import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function ResumePage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const resume = await prisma.resume.findUnique({ where: { id: params.id } })
  if (!resume || resume.userId !== session.user.id) notFound()

  return (
    <main className="page">
      <h1>Extracted text</h1>
      <p>
        <span className="badge">extraction: {resume.extractionMethod}</span>
      </p>
      <pre className="card">{resume.rawText}</pre>
      <p>
        <a href={`/resumes/${resume.id}/tailor`}>Tailor for a job &rarr;</a>
        {" · "}
        <a href={`/resumes/${resume.id}/check`}>Fit check &rarr;</a>
      </p>
    </main>
  )
}
