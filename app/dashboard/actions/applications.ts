"use server"

import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function addApplication(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  const companyName = formData.get("companyName") as string
  const roleTitle = formData.get("roleTitle") as string
  const dateApplied = formData.get("dateApplied") as string
  const source = formData.get("source") as string
  const status = formData.get("status") as string

  await prisma.application.create({
    data: {
      userId: session.user.id,
      companyName,
      roleTitle,
      dateApplied: new Date(dateApplied),
      source,
      status,
    },
  })

  redirect("/dashboard")
}

export async function updateApplicationStatus(id: string, status: string) {
    const session = await auth()
  
    if (!session?.user?.id) {
      throw new Error("Not authenticated")
    }
  
    await prisma.application.update({
      where: { id, userId: session.user.id },
      data: { status },
    })
  }