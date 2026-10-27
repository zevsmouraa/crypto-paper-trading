import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET() { const month = new Date().toISOString().slice(0, 7); const session = await getServerSession(authOptions); const users = await db.user.findMany({ include: { snapshots: { orderBy: { createdAt: "asc" }, take: 1 } }, orderBy: { cashBalance: "desc" }, take: 25 }); return Response.json({ month, leaderboard: users.map((user, index) => ({ rank: index + 1, name: user.name ?? user.email.split("@")[0], returnPct: Number((((user.cashBalance - 100000) / 100000) * 100).toFixed(2)), isCurrentUser: user.id === session?.user?.id })) }); }
