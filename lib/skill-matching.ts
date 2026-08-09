import { Skill } from "@prisma/client"
import { prisma } from "@/lib/prisma"

// eslint-disable-next-line @typescript-eslint/no-unused-vars


function escapeRegex(str: string): string {
  // escape regex special characters so skill names like "C++" or "C#" match literally
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  
}

function skillAppearsInText(term: string, lowerText: string): boolean {
  // build a word-boundary regex from the (escaped) term, test against lowerText
  const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i')
  return regex.test(lowerText)
}

export async function matchSkills(query: string): Promise<Skill[]> {
  const allSkills = await prisma.skill.findMany()
  const lowerQuery = query.toLowerCase()

  // for each skill, check if its name OR any alias appears in lowerQuery
  // collect the skills that matched, avoiding duplicates
   return allSkills.filter((skill) => {
    // check if skill.name matches, OR if any alias in skill.aliases matches
    return skillAppearsInText(skill.name, lowerQuery) || skill.aliases.some((alias) => skillAppearsInText(alias, lowerQuery))
  })
}