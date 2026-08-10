import { draftTailoredBullets } from "./agent-a"
import { scoreTailoredBullets } from "./agent-b"

type Attempt = {
  output: string
  score: number
  feedback: string
}


function getBestAttempt(attempts: Attempt[]): Attempt {
  return attempts.reduce((best, current) => (current.score > best.score ? current : best), attempts[0])
}

export async function runCriticLoop(
  resumeText: string,
  jobDescription: string
): Promise<{ finalOutput: string; criticScore: number; loopsRun: number }> {
  const THRESHOLD = 80
  const MAX_ATTEMPTS = 3
  const attempts: Attempt[] = []

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (attempts.length === 0) {
      const output = await draftTailoredBullets(resumeText, jobDescription)
      const { score, feedback } = await scoreTailoredBullets(output, jobDescription)
      attempts.push({ output, score, feedback: `Attempt ${attempts.length + 1}: ${feedback}` })
    } else if (attempts.length > 0 && attempts[attempts.length - 1].score < THRESHOLD) {
      const bestAttempt = getBestAttempt(attempts)
      const output = await draftTailoredBullets(resumeText, jobDescription, bestAttempt.output, bestAttempt.feedback)
      const { score, feedback } = await scoreTailoredBullets(output, jobDescription)
      attempts.push({
        output,
        score,
        feedback: `Attempt ${attempts.length + 1}: ${feedback}`,
      })
    }
  }

  // your fallback logic here
  const finalAttempt = getBestAttempt(attempts)
  return {
    finalOutput: finalAttempt.output,
    criticScore: finalAttempt.score,
    loopsRun: attempts.length,
  }
}
