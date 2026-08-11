import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { sendRegistrationApprovedEmail, sendRegistrationRejectedEmail } from "@/lib/email"

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!currentUser || currentUser.role !== "ADMIN") {
            return new NextResponse("Forbidden - Requires Admin", { status: 403 })
        }

        const { status } = await req.json()
        if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 })
        }

        const targetUser = await prisma.user.findUnique({ where: { id: params.id } })
        if (!targetUser) {
            return new NextResponse("User not found", { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            // @ts-ignore
            data: { accountStatus: status }
        })

        // Notify user via email
        if (status === "APPROVED" && targetUser.email) {
            sendRegistrationApprovedEmail({ name: targetUser.name, email: targetUser.email }).catch(console.error)
        } else if (status === "REJECTED" && targetUser.email) {
            sendRegistrationRejectedEmail({ name: targetUser.name, email: targetUser.email }).catch(console.error)
        }

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating user status:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
