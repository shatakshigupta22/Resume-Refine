import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <main className="page">
      <h1>Sign in</h1>
      <form
        action={async (formData) => {
          "use server"
          await signIn("resend", {
            email: formData.get("email"),
            redirectTo: "/",
          })
        }}
      >
        <input type="email" name="email" placeholder="you@example.com" required />
        <button type="submit">Send magic link</button>
      </form>
    </main>
  )
}
