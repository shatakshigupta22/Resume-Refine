import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", fontFamily: "sans-serif" }}>
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
