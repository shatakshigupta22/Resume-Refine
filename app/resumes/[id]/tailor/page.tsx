import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SubmitForm } from "@/app/components/SubmitForm"

export default async function TailorPage({
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
      <h1>Tailor this resume</h1>
      {searchParams.error && (
        <p className="error-message">
          Something went wrong generating your tailored bullets. Please try again.
        </p>
      )}
      <SubmitForm
        action="/api/tailor"
        buttonText="Generate tailored bullets"
        loadingText="Generating... this can take up to 30 seconds"
      >
        <input type="hidden" name="resumeId" value={resume.id} />
        <textarea name="jobDescription" rows={12} placeholder="Paste the job description here..." required />
      </SubmitForm>
      <p>
        <a href={`/resumes/${resume.id}`}>Back to resume</a>
      </p>
    </main>
  )
}
