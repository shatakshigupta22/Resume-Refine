import { redirect } from "next/navigation"

import { auth } from "@/auth"

export default async function UploadPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", fontFamily: "sans-serif" }}>
      <h1>Upload your resume</h1>
      <form action="/api/resumes" method="POST" encType="multipart/form-data">
        <input type="file" name="resume" accept="application/pdf" required />
        <button type="submit">Upload</button>
      </form>
    </main>
  )
}
