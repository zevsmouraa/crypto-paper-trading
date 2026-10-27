import { describe, expect, it } from "vitest";
import { applyTrade, validateTrade } from "./trading";
const account = { cashBalance: 100000, holdingQuantity: 0, holdingAverageCost: 0 };
describe("paper trade engine", () => {
  it("buys and updates average cost", () => { const result = applyTrade({ ...account, side: "BUY", quantity: 2, price: 100 }); expect(result.cashBalance).toBe(99800); expect(result.holdingQuantity).toBe(2); expect(result.holdingAverageCost).toBe(100); });
  it("rejects buys beyond cash", () => { expect(() => validateTrade({ ...account, side: "BUY", quantity: 2, price: 60000 })).toThrow(/cash/); });
  it("rejects oversells and zero quantity", () => { expect(() => validateTrade({ ...account, side: "SELL", quantity: 1, price: 100 })).toThrow(/sell/); expect(() => validateTrade({ ...account, side: "BUY", quantity: 0, price: 100 })).toThrow(/zero/); });
  it("sells at market price and preserves average cost", () => { const result = applyTrade({ cashBalance: 99000, holdingQuantity: 10, holdingAverageCost: 100, side: "SELL", quantity: 2, price: 120 }); expect(result.cashBalance).toBe(99240); expect(result.holdingQuantity).toBe(8); expect(result.holdingAverageCost).toBe(100); });
});
