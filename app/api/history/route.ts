import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() { const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Sign in required." }, { status: 401 }); return Response.json({ trades: await db.trade.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 100 }) }); }
