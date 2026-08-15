import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProseBlock } from "@/app/components/ProseBlock"

export default async function ResumePage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const resume = await prisma.resume.findUnique({ where: { id: params.id } })
  if (!resume || resume.userId !== session.user.id) notFound()

  return (
    <main className="page">
      <h1>Extracted text</h1>
      <p>
        <a href={`/resumes/${resume.id}/tailor`}>Tailor for a job &rarr;</a>
        {" · "}
        <a href={`/resumes/${resume.id}/check`}>Fit check &rarr;</a>
        {" · "}
        <a href="/resumes">Back to all resumes</a>
      </p>
      <p>
        <span className="badge">extraction: {resume.extractionMethod}</span>
      </p>
      <ProseBlock text={resume.rawText} />
      <p>
        <a href={`/resumes/${resume.id}/tailor`}>Tailor for a job &rarr;</a>
        {" · "}
        <a href={`/resumes/${resume.id}/check`}>Fit check &rarr;</a>
      </p>
      <p>
        <a href="/resumes">Back to all resumes</a>
      </p>
    </main>
  )
}
