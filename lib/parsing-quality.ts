// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isTooShort(text: string): boolean {
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.length < 100
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isMissingKeywords(text: string): boolean {
  const keywords = ['experience', 'education', 'skills', 'projects', 'certifications', 'achievements']
  const lowerText = text.toLowerCase()
  return !keywords.some((keyword) => lowerText.includes(keyword))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasBadCharComposition(text: string): boolean {
  const totalChars = text.length
  const nonAlphaNumChars = text.replace(/[a-zA-Z0-9\s]/g, '').length
  const ratio = nonAlphaNumChars / totalChars
  if (ratio > 0.5) {
    return true
  } 
  return false
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasNonprintableChars(text: string): boolean {
  const nonPrintableRegex = /[\uFFFD]/
  return nonPrintableRegex.test(text)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasLineFragmentation(text: string): boolean {
  const lines = text.split('\n').filter((line) => line.trim().length > 0)
  if (lines.length === 0) return true
  const fragmentedLines = lines.filter((line) => line.trim().length < 3)
  return fragmentedLines.length / lines.length > 0.3
}

export function isParsingGarbage(text: string): boolean {
  const checks = [
    isTooShort,
    isMissingKeywords,
    hasBadCharComposition,
    hasNonprintableChars,
    hasLineFragmentation,
  ]

  const failures = checks.filter((check) => check(text)).length
  return failures >= 2
}
