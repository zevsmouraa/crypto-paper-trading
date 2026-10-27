export type TradeSide = "BUY" | "SELL";

export type AccountState = {
  cashBalance: number;
  holdingQuantity: number;
  holdingAverageCost: number;
};

export type TradeInput = AccountState & {
  side: TradeSide;
  quantity: number;
  price: number;
};

export function validateTrade(input: TradeInput) {
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) throw new Error("Quantity must be greater than zero.");
  if (!Number.isFinite(input.price) || input.price <= 0) throw new Error("Price must be greater than zero.");
  const total = input.quantity * input.price;
  if (input.side === "BUY" && total > input.cashBalance + 1e-8) throw new Error("Not enough paper cash for this trade.");
  if (input.side === "SELL" && input.quantity > input.holdingQuantity + 1e-8) throw new Error("You cannot sell more than you hold.");
  return { total };
}

export function applyTrade(input: TradeInput) {
  const { total } = validateTrade(input);
  if (input.side === "BUY") {
    const nextQuantity = input.holdingQuantity + input.quantity;
    return { cashBalance: input.cashBalance - total, holdingQuantity: nextQuantity, holdingAverageCost: (input.holdingQuantity * input.holdingAverageCost + total) / nextQuantity, total };
  }
  return { cashBalance: input.cashBalance + total, holdingQuantity: input.holdingQuantity - input.quantity, holdingAverageCost: input.holdingAverageCost, total };
}
