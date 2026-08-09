import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function TailorJobPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const tailorJob = await prisma.tailorJob.findUnique({
    where: { id: params.id },
    include: { resume: true },
  })
  if (!tailorJob || tailorJob.resume.userId !== session.user.id) notFound()

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", fontFamily: "sans-serif" }}>
      <h1>Tailored bullets</h1>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "1rem" }}>
        {tailorJob.tailoredOutput}
      </pre>
    </main>
  )
}
