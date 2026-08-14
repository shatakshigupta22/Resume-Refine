"use client"

import { useState } from "react"

export function SubmitForm({
  action,
  buttonText,
  loadingText,
  children,
}: {
  action: string
  buttonText: string
  loadingText: string
  children: React.ReactNode
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form action={action} method="POST" onSubmit={() => setIsSubmitting(true)}>
      {children}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? loadingText : buttonText}
      </button>
    </form>
  )
}
