import { auth, signOut } from "@/auth"

export async function Header() {
  const session = await auth()
  if (!session?.user) return null

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="wordmark">
          ResumeRefine
        </a>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </div>
    </header>
  )
}
