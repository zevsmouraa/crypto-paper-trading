import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMarket } from "@/lib/market";
export async function GET() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Sign in required." }, { status: 401 });
  const [user, holdings, snapshots] = await Promise.all([db.user.findUniqueOrThrow({ where: { id: session.user.id } }), db.holding.findMany({ where: { userId: session.user.id }, orderBy: { quantity: "desc" } }), db.netWorthSnapshot.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" }, take: 30 })]);
  const market = await getMarket(); const rows = holdings.map((holding) => { const coin = market.find((item) => item.id === holding.coinId); const price = coin?.price ?? holding.averageCost; return { ...holding, price, value: holding.quantity * price, pnl: holding.quantity * (price - holding.averageCost) }; });
  return Response.json({ cashBalance: user.cashBalance, holdings: rows, snapshots: snapshots.map((snapshot) => ({ value: snapshot.value, createdAt: snapshot.createdAt })) });
}
