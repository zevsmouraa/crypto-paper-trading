import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { applyTrade, type TradeSide } from "@/lib/trading";
import { getMarket } from "@/lib/market";
import { z } from "zod";

const schema = z.object({ coinId: z.string().min(1), side: z.enum(["BUY", "SELL"]), quantity: z.number().positive().finite() });
export async function POST(request: Request) {
  const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Sign in required." }, { status: 401 });
  try {
    const body = schema.parse(await request.json()); const coin = (await getMarket()).find((item) => item.id === body.coinId); if (!coin) return Response.json({ error: "Coin not found." }, { status: 404 });
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: session.user.id } }); const holding = await tx.holding.findUnique({ where: { userId_coinId: { userId: user.id, coinId: coin.id } } });
      const applied = applyTrade({ cashBalance: user.cashBalance, holdingQuantity: holding?.quantity ?? 0, holdingAverageCost: holding?.averageCost ?? 0, side: body.side as TradeSide, quantity: body.quantity, price: coin.price });
      await tx.user.update({ where: { id: user.id }, data: { cashBalance: applied.cashBalance } });
      if (applied.holdingQuantity > 1e-8) await tx.holding.upsert({ where: { userId_coinId: { userId: user.id, coinId: coin.id } }, create: { userId: user.id, coinId: coin.id, symbol: coin.symbol, name: coin.name, quantity: applied.holdingQuantity, averageCost: applied.holdingAverageCost }, update: { quantity: applied.holdingQuantity, averageCost: applied.holdingAverageCost, symbol: coin.symbol, name: coin.name } });
      else if (holding) await tx.holding.delete({ where: { id: holding.id } });
      await tx.trade.create({ data: { userId: user.id, coinId: coin.id, symbol: coin.symbol, name: coin.name, side: body.side, quantity: body.quantity, price: coin.price, total: applied.total } });
      await tx.netWorthSnapshot.create({ data: { userId: user.id, value: applied.cashBalance + (await tx.holding.aggregate({ where: { userId: user.id }, _sum: { quantity: true } }))._sum.quantity! * 0 } });
      return applied;
    });
    return Response.json({ trade: result });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Trade failed." }, { status: 400 }); }
}
