import { auth, signOut } from "@/auth"

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
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button type="submit">Sign out</button>
          </form>
        </>
      ) : (
        <p>
          <a href="/login">Sign in</a>
        </p>
      )}
    </main>
  )
}
