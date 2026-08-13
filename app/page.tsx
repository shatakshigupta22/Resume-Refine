import { auth } from "@/auth"

export default async function HomePage() {
  const session = await auth()

  return (
    <main className="page">
      <h1>ResumeRefine</h1>
      {session?.user ? (
        <>
          <p>Signed in as {session.user.email}</p>
          <p>
            <a href="/resumes">Your resumes</a>
          </p>
        </>
      ) : (
        <>
          <p>
            AI-powered resume tailoring — upload a resume, paste a job description, get bullets
            tailored to match.
          </p>
          <p>
            <a href="/login" className="btn">
              Sign in
            </a>
          </p>
        </>
      )}
    </main>
  )
}
