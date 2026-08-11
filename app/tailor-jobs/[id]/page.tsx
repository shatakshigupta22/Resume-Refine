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
    <main className="page">
      <h1>Tailored bullets</h1>
      <pre className="card">{tailorJob.tailoredOutput}</pre>
    </main>
  )
}
