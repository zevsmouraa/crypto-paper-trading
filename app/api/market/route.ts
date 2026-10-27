import { getMarket } from "@/lib/market";
export async function GET() { return Response.json({ coins: await getMarket(), source: "CoinGecko with fallback" }); }
