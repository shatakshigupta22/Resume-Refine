import { matchSkills } from "../lib/skill-matching"
import { prisma } from "../lib/prisma"

const query = "3+ years React experience, familiar with Redux, TypeScript, and PostgreSQL"

async function main() {
  const results = await matchSkills(query)

  console.log(`Query: "${query}"`)
  console.log(`Matched ${results.length} skill(s):`)
  for (const skill of results) {
    console.log(`- ${skill.name} (${skill.category})`)
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
