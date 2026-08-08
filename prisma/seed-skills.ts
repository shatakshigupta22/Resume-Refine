import { prisma } from "../lib/prisma"

type SeedSkill = {
  name: string
  category: "language" | "framework" | "cloud" | "database" | "tool"
  aliases: string[]
}

const skills: SeedSkill[] = [
  // languages
  { name: "JavaScript", category: "language", aliases: ["JS", "Javascript", "ECMAScript"] },
  { name: "TypeScript", category: "language", aliases: ["TS", "Typescript"] },
  { name: "Python", category: "language", aliases: ["Py"] },
  { name: "Java", category: "language", aliases: [] },
  { name: "C++", category: "language", aliases: ["Cpp", "C Plus Plus"] },
  { name: "C#", category: "language", aliases: ["CSharp", "C Sharp"] },
  { name: "Go", category: "language", aliases: ["Golang"] },
  { name: "Rust", category: "language", aliases: [] },
  { name: "Ruby", category: "language", aliases: [] },
  { name: "PHP", category: "language", aliases: [] },
  { name: "Swift", category: "language", aliases: [] },
  { name: "Kotlin", category: "language", aliases: [] },
  { name: "Scala", category: "language", aliases: [] },
  { name: "R", category: "language", aliases: ["R Language", "R Programming"] },
  { name: "MATLAB", category: "language", aliases: [] },
  { name: "Perl", category: "language", aliases: [] },
  { name: "Objective-C", category: "language", aliases: ["ObjC", "Objective C"] },
  { name: "Dart", category: "language", aliases: [] },
  { name: "Elixir", category: "language", aliases: [] },
  { name: "Haskell", category: "language", aliases: [] },

  // frameworks / libraries
  { name: "React", category: "framework", aliases: ["React.js", "ReactJS"] },
  { name: "Angular", category: "framework", aliases: ["AngularJS", "Angular.js"] },
  { name: "Vue.js", category: "framework", aliases: ["Vue", "VueJS"] },
  { name: "Next.js", category: "framework", aliases: ["NextJS"] },
  { name: "Nuxt.js", category: "framework", aliases: ["Nuxt", "NuxtJS"] },
  { name: "Svelte", category: "framework", aliases: ["SvelteJS"] },
  { name: "Express.js", category: "framework", aliases: ["Express", "ExpressJS"] },
  { name: "NestJS", category: "framework", aliases: ["Nest.js", "Nest"] },
  { name: "Django", category: "framework", aliases: [] },
  { name: "Flask", category: "framework", aliases: [] },
  { name: "FastAPI", category: "framework", aliases: [] },
  { name: "Spring Boot", category: "framework", aliases: ["Spring"] },
  { name: "Ruby on Rails", category: "framework", aliases: ["Rails", "RoR"] },
  { name: "ASP.NET Core", category: "framework", aliases: ["ASP.NET", ".NET Core"] },
  { name: "Laravel", category: "framework", aliases: [] },
  { name: "jQuery", category: "framework", aliases: [] },
  { name: "Redux", category: "framework", aliases: [] },
  { name: "GraphQL", category: "framework", aliases: [] },
  { name: "TensorFlow", category: "framework", aliases: ["TF"] },
  { name: "PyTorch", category: "framework", aliases: [] },
  { name: "scikit-learn", category: "framework", aliases: ["sklearn", "Scikit Learn"] },
  { name: "Pandas", category: "framework", aliases: [] },
  { name: "NumPy", category: "framework", aliases: [] },

  // cloud / devops
  { name: "AWS", category: "cloud", aliases: ["Amazon Web Services"] },
  { name: "Azure", category: "cloud", aliases: ["Microsoft Azure"] },
  { name: "Google Cloud Platform", category: "cloud", aliases: ["GCP", "Google Cloud"] },
  { name: "Docker", category: "cloud", aliases: [] },
  { name: "Kubernetes", category: "cloud", aliases: ["K8s"] },
  { name: "Terraform", category: "cloud", aliases: [] },
  { name: "Ansible", category: "cloud", aliases: [] },
  { name: "Jenkins", category: "cloud", aliases: [] },
  { name: "GitHub Actions", category: "cloud", aliases: [] },
  { name: "CircleCI", category: "cloud", aliases: [] },
  { name: "Vercel", category: "cloud", aliases: [] },
  { name: "Netlify", category: "cloud", aliases: [] },
  { name: "Heroku", category: "cloud", aliases: [] },
  { name: "CloudFormation", category: "cloud", aliases: ["AWS CloudFormation"] },
  { name: "Serverless Framework", category: "cloud", aliases: ["Serverless"] },

  // databases
  { name: "PostgreSQL", category: "database", aliases: ["Postgres", "psql"] },
  { name: "MySQL", category: "database", aliases: [] },
  { name: "MongoDB", category: "database", aliases: ["Mongo"] },
  { name: "Redis", category: "database", aliases: [] },
  { name: "SQLite", category: "database", aliases: [] },
  { name: "Cassandra", category: "database", aliases: ["Apache Cassandra"] },
  { name: "DynamoDB", category: "database", aliases: ["AWS DynamoDB"] },
  { name: "Elasticsearch", category: "database", aliases: ["ES", "Elastic"] },
  { name: "Oracle Database", category: "database", aliases: ["Oracle DB", "Oracle"] },
  { name: "Microsoft SQL Server", category: "database", aliases: ["MSSQL", "SQL Server"] },
  { name: "Firebase Firestore", category: "database", aliases: ["Firestore"] },
  { name: "Neo4j", category: "database", aliases: [] },
  { name: "MariaDB", category: "database", aliases: [] },
  { name: "CockroachDB", category: "database", aliases: ["Cockroach"] },

  // general tools
  { name: "Git", category: "tool", aliases: [] },
  { name: "Jira", category: "tool", aliases: [] },
  { name: "Figma", category: "tool", aliases: [] },
  { name: "Postman", category: "tool", aliases: [] },
  { name: "Webpack", category: "tool", aliases: [] },
  { name: "Vite", category: "tool", aliases: [] },
  { name: "Babel", category: "tool", aliases: [] },
  { name: "ESLint", category: "tool", aliases: [] },
  { name: "Jest", category: "tool", aliases: [] },
  { name: "Cypress", category: "tool", aliases: [] },
  { name: "Selenium", category: "tool", aliases: [] },
  { name: "REST API", category: "tool", aliases: ["REST", "RESTful API"] },
  { name: "gRPC", category: "tool", aliases: [] },
  { name: "RabbitMQ", category: "tool", aliases: [] },
  { name: "Kafka", category: "tool", aliases: ["Apache Kafka"] },
  { name: "Nginx", category: "tool", aliases: [] },
  { name: "Linux", category: "tool", aliases: [] },
  { name: "Bash", category: "tool", aliases: ["Shell scripting", "Bash scripting"] },
]

async function main() {
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category, aliases: skill.aliases },
      create: skill,
    })
  }
  console.log(`Seeded ${skills.length} skills.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
