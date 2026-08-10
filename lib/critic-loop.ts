import { draftTailoredBullets } from "./agent-a"

export async function runCriticLoop(
  resumeText: string,
  jobDescription: string
): Promise<{ finalOutput: string; criticScore: number; loopsRun: number }> {
  // TODO: Shatakshi implements this
  const finalOutput = await draftTailoredBullets(resumeText, jobDescription)
  return { finalOutput, criticScore: 0, loopsRun: 1 }
}
