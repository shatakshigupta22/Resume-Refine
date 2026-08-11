export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { createMcpHandler } from "mcp-handler"
import { z } from "zod"

import { matchSkills } from "@/lib/skill-matching"

const mcpHandler = createMcpHandler((server) => {
  server.registerTool(
    "search_skills",
    {
      title: "Search Skills",
      description:
        "Search the standardized tech skills table for canonical skill names matching a free-text query (e.g. a resume bullet or job description snippet).",
      inputSchema: z.object({ query: z.string() }),
    },
    async ({ query }) => {
      const skills = await matchSkills(query)
      return {
        content: [{ type: "text", text: JSON.stringify(skills) }],
      }
    }
  )
})

async function handler(request: NextRequest) {
  const expectedSecret = process.env.MCP_SHARED_SECRET
  const authHeader = request.headers.get("authorization")

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return mcpHandler(request)
}

export { handler as GET, handler as POST }
