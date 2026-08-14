import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProseBlock } from "@/app/components/ProseBlock"
import { SubmitForm } from "@/app/components/SubmitForm"

export default async function TailorJobPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { error?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const tailorJob = await prisma.tailorJob.findUnique({
    where: { id: params.id },
    include: { resume: true },
  })
  if (!tailorJob || tailorJob.resume.userId !== session.user.id) notFound()

  return (
    <main className="page">
      <h1>Tailored bullets</h1>
      {searchParams.error && (
        <p className="error-message">Something went wrong checking these bullets. Please try again.</p>
      )}
      <p>
        <span className="badge badge-accent">score: {tailorJob.criticScore ?? "—"}/100</span>
      </p>
      <ProseBlock text={tailorJob.tailoredOutput ?? ""} />
      <p>
        <a href={`/resumes/${tailorJob.resumeId}`}>Back to resume</a>
        {" · "}
        <a href={`/resumes/${tailorJob.resumeId}/check`}>Fit check original resume</a>
      </p>
      <SubmitForm
        action="/api/check-tailored"
        buttonText="Fit check these tailored bullets"
        loadingText="Checking fit..."
      >
        <input type="hidden" name="tailorJobId" value={tailorJob.id} />
      </SubmitForm>
    </main>
  )
}
