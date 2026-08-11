import { redirect } from "next/navigation"

import { auth } from "@/auth"

export default async function UploadPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <main className="page">
      <h1>Upload your resume</h1>
      {searchParams.error && (
        <p className="error-message">
          Something went wrong processing your upload. Please try again.
        </p>
      )}
      <form action="/api/resumes" method="POST" encType="multipart/form-data">
        <input type="file" name="resume" accept="application/pdf" required />
        <button type="submit">Upload</button>
      </form>
    </main>
  )
}
