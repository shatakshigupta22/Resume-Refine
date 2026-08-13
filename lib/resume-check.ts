import Anthropic from "@anthropic-ai/sdk"

import { matchSkills } from "@/lib/skill-matching"

export async function checkResumeFit(
  resumeText: string,
  jobDescription?: string
): Promise<{ score: number; feedback: string; missingSkills: string[] }> {
  let missingSkills: string[] = []

  if (jobDescription) {
    const [jdSkills, resumeSkills] = await Promise.all([
      matchSkills(jobDescription),
      matchSkills(resumeText),
    ])
    const resumeSkillNames = new Set(resumeSkills.map((skill) => skill.name))
    missingSkills = jdSkills.filter((skill) => !resumeSkillNames.has(skill.name)).map((skill) => skill.name)
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const system = jobDescription
    ? "You are an experienced technical recruiter. Score how well this resume fits the given job description, out of 100, without rewriting it. Provide specific, actionable feedback referencing gaps between the resume and the job description."
    : "You are an experienced technical recruiter. Score the overall strength of this resume out of 100, without rewriting it. Provide specific, actionable feedback on action verbs, quantified impact, and structure."

  const userContent = jobDescription
    ? `Job description:\n${jobDescription}\n\nResume:\n${resumeText}\n\nSkills present in the job description but not clearly reflected in the resume: ${
        missingSkills.length ? missingSkills.join(", ") : "(none detected)"
      }`
    : `Resume:\n${resumeText}`

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system,
    tools: [
      {
        name: "submit_check",
        description: "Submit the recruiter's score and feedback for this resume.",
        input_schema: {
          type: "object",
          properties: {
            score: { type: "number", description: "Score from 0-100." },
            feedback: { type: "string", description: "Specific, actionable feedback." },
          },
          required: ["score", "feedback"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "submit_check" },
    messages: [{ role: "user", content: userContent }],
  })

  const toolUseBlock = message.content.find(
    (block) => block.type === "tool_use" && block.name === "submit_check"
  )
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Resume check did not return a submit_check tool call")
  }

  const input = toolUseBlock.input as { score: number; feedback: string }
  return { score: input.score, feedback: input.feedback, missingSkills }
}
