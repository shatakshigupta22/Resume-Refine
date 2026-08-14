import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SubmitForm } from "@/app/components/SubmitForm"

export default async function CheckPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { error?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const resume = await prisma.resume.findUnique({ where: { id: params.id } })
  if (!resume || resume.userId !== session.user.id) notFound()

  return (
    <main className="page">
      <h1>Fit check</h1>
      {searchParams.error && (
        <p className="error-message">Something went wrong checking this resume. Please try again.</p>
      )}
      <SubmitForm action="/api/check" buttonText="Check fit" loadingText="Checking fit...">
        <input type="hidden" name="resumeId" value={resume.id} />
        <textarea
          name="jobDescription"
          rows={12}
          placeholder="Paste a job description for a targeted check, or leave blank for a general resume review"
        />
      </SubmitForm>
      <p>
        <a href={`/resumes/${resume.id}`}>Back to resume</a>
      </p>
    </main>
  )
}
