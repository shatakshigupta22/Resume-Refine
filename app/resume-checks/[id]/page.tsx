import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProseBlock } from "@/app/components/ProseBlock"

export default async function ResumeCheckPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const resumeCheck = await prisma.resumeCheck.findUnique({
    where: { id: params.id },
    include: { resume: true },
  })
  if (!resumeCheck || resumeCheck.resume.userId !== session.user.id) notFound()

  return (
    <main className="page">
      <h1>Fit check results</h1>
      <p>
        <a href={`/resumes/${resumeCheck.resumeId}`}>Back to resume</a>
        {" · "}
        <a href={`/resumes/${resumeCheck.resumeId}/tailor`}>Tailor for a job</a>
      </p>
      <p>
        <span className="badge badge-accent">score: {resumeCheck.score}/100</span>
      </p>
      <ProseBlock text={resumeCheck.feedback} />
      {resumeCheck.missingSkills.length > 0 && (
        <>
          <p>Missing skills:</p>
          <div className="badge-list">
            {resumeCheck.missingSkills.map((skill) => (
              <span key={skill} className="badge">
                {skill}
              </span>
            ))}
          </div>
        </>
      )}
      <p>
        <a href={`/resumes/${resumeCheck.resumeId}`}>Back to resume</a>
        {" · "}
        <a href={`/resumes/${resumeCheck.resumeId}/tailor`}>Tailor for a job</a>
      </p>
    </main>
  )
}
