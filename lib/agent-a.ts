import Anthropic from "@anthropic-ai/sdk"

export async function draftTailoredBullets(resumeText: string, jobDescription: string): Promise<string> {
  const mcpServerUrl = process.env.MCP_SERVER_URL
  if (!mcpServerUrl) {
    throw new Error("MCP_SERVER_URL is not set")
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await anthropic.beta.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    betas: ["mcp-client-2025-11-20"],
    mcp_servers: [{ type: "url", url: mcpServerUrl, name: "skills-mcp" }],
    tools: [{ type: "mcp_toolset", mcp_server_name: "skills-mcp" }],
    system:
      "You are a resume-tailoring assistant. Given raw resume text and a job description, use the search_skills tool to standardize any skill terminology mentioned in the resume or job description, then draft 4-6 tailored resume bullet points emphasizing the candidate's relevant experience for this job, using standardized skill names where applicable. Return only the bullet points, no preamble or commentary.",
    messages: [
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob description:\n${jobDescription}`,
      },
    ],
  })

  const toolUseBlocks = message.content.filter((block) => block.type === "mcp_tool_use")
  if (toolUseBlocks.length === 0) {
    console.warn("[agent-a] model did not invoke search_skills for this request")
  } else {
    for (const block of toolUseBlocks) {
      console.log(`[agent-a] search_skills called with:`, block.input)
    }
  }

  const textBlocks = message.content.filter((block) => block.type === "text")
  const lastTextBlock = textBlocks[textBlocks.length - 1]
  return lastTextBlock?.text ?? ""
}
