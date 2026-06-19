"use server"

import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { GoogleGenerativeAI } from "@google/generative-ai"

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const JOB_KEYWORDS = [
  "application received",
  "thank you for applying",
  "thank you for your application",
  "we received your application",
  "your application for",
  "interview",
  "job offer",
  "offer letter",
  "unfortunately",
  "we regret",
  "position has been filled",
  "moving forward",
  "next steps",
]

export async function syncGmailApplications() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "google",
    },
  })

  if (!account?.access_token) {
    throw new Error("No Gmail access token found. Please sign in again.")
  }

  const query = JOB_KEYWORDS.map((k) => `"${k}"`).join(" OR ")
console.log("Gmail query:", query)

const gmailRes = await fetch(
  `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=20`,
  {
    headers: { Authorization: `Bearer ${account.access_token}` },
  }
)

const gmailData = await gmailRes.json()
console.log("Gmail API response:", JSON.stringify(gmailData))

if (!gmailData.messages || gmailData.messages.length === 0) {
  return { synced: 0, message: "No job-related emails found." }
}

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
  let synced = 0

  for (const msg of gmailData.messages.slice(0, 5)) {
        const msgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
      {
        headers: { Authorization: `Bearer ${account.access_token}` },
      }
    )
    const msgData = await msgRes.json()
    const subject = msgData.payload?.headers?.find(
        (h: { name: string }) => h.name === "Subject"
      )?.value || ""
      
      const dateHeader = msgData.payload?.headers?.find(
        (h: { name: string }) => h.name === "Date"
      )?.value
      
      const emailDate = dateHeader ? new Date(dateHeader) : new Date()

    const snippet = msgData.snippet || ""
    const emailText = `Subject: ${subject}\n\n${snippet}`

    const prompt = `
    You are an AI that extracts job application information from emails.
    
    Given this email, extract:
    1. Company name
    2. Job title/role
    3. Application status — choose based on these rules:
       - "Applied" — confirms receipt of application, no decision yet
       - "Interview" — invites to interview, schedules a call, or mentions next steps/screening
       - "Offer" — extends a job offer or offer letter
       - "Rejected" — says "unfortunately", "not moving forward", "other candidates", "regret to inform"
    
    If this email is NOT related to a job application, return null.
    
    Email:
    ${emailText}
    
    Respond ONLY with valid JSON in this exact format, nothing else:
    {"companyName": "...", "roleTitle": "...", "status": "Applied|Interview|Offer|Rejected"}
    
    Or if not a job email:
    null
    `

async function generateWithRetry(model: any, prompt: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await model.generateContent(prompt)
        return result.response.text().trim()
      } catch (err) {
        if (i === retries - 1) throw err
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)))
      }
    }
    throw new Error("Failed after retries")
  }
  
  const text = await generateWithRetry(model, prompt)

    if (text === "null" || !text) continue

    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim())
      if (!parsed.companyName || !parsed.roleTitle) continue

      const existing = await prisma.application.findFirst({
        where: {
          userId: session.user.id,
          companyName: { equals: parsed.companyName, mode: "insensitive" },
          roleTitle: { equals: parsed.roleTitle, mode: "insensitive" },
        },
      })

      if (!existing) {
        await prisma.application.create({
          data: {
            userId: session.user.id,
            companyName: parsed.companyName,
            roleTitle: parsed.roleTitle,
            dateApplied: emailDate,
            source: "Gmail Sync",
            status: parsed.status || "Applied",
          },
        })
        synced++
      }
    } catch {
      continue
    }
  }

  return { synced, message: `Synced ${synced} new applications from Gmail!` }
}