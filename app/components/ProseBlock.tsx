export function ProseBlock({ text }: { text: string }) {
  const paragraphs = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <div className="card prose">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
