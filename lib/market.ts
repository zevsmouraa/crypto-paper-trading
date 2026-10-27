/* eslint-disable @typescript-eslint/no-explicit-any */
export type MarketCoin = { id: string; symbol: string; name: string; price: number; change24h: number; sparkline: number[]; image?: string };

const fallbackNames = [
  ["bitcoin", "BTC", "Bitcoin", 68500], ["ethereum", "ETH", "Ethereum", 3520], ["tether", "USDT", "Tether", 1], ["binancecoin", "BNB", "BNB", 605], ["solana", "SOL", "Solana", 168], ["usd-coin", "USDC", "USDC", 1], ["xrp", "XRP", "XRP", 0.52], ["dogecoin", "DOGE", "Dogecoin", 0.14], ["cardano", "ADA", "Cardano", 0.34], ["avalanche-2", "AVAX", "Avalanche", 27], ["tron", "TRX", "TRON", 0.16], ["chainlink", "LINK", "Chainlink", 14], ["polkadot", "DOT", "Polkadot", 4.2], ["polygon", "POL", "Polygon", 0.28], ["wrapped-bitcoin", "WBTC", "Wrapped BTC", 68400], ["internet-computer", "ICP", "Internet Computer", 8.4], ["shiba-inu", "SHIB", "Shiba Inu", 0.000013], ["litecoin", "LTC", "Litecoin", 72], ["dai", "DAI", "Dai", 1], ["uniswap", "UNI", "Uniswap", 7.4]] as const;

export const fallbackMarket: MarketCoin[] = fallbackNames.map(([id, symbol, name, price], index) => ({ id, symbol, name, price, change24h: ((index % 7) - 3) * 1.17, sparkline: Array.from({ length: 16 }, (_, i) => price * (1 + Math.sin(i / 2 + index) * 0.015)) }));

export async function getMarket(): Promise<MarketCoin[]> {
  try {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h";
    const response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(4000), headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("CoinGecko unavailable");
    const data = await response.json();
    return data.map((coin: any) => ({ id: coin.id, symbol: coin.symbol.toUpperCase(), name: coin.name, price: coin.current_price, change24h: coin.price_change_percentage_24h ?? 0, sparkline: coin.sparkline_in_7d?.price?.slice(-24) ?? [], image: coin.image }));
  } catch {
    return fallbackMarket;
  }
}
