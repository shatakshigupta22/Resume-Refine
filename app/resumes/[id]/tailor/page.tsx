import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function TailorPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const resume = await prisma.resume.findUnique({ where: { id: params.id } })
  if (!resume || resume.userId !== session.user.id) notFound()

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", fontFamily: "sans-serif" }}>
      <h1>Tailor this resume</h1>
      <form action="/api/tailor" method="POST">
        <input type="hidden" name="resumeId" value={resume.id} />
        <textarea
          name="jobDescription"
          rows={12}
          style={{ width: "100%" }}
          placeholder="Paste the job description here..."
          required
        />
        <button type="submit">Generate tailored bullets</button>
      </form>
    </main>
  )
}
