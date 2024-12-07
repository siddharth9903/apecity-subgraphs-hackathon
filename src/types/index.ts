export type * from "./general";

export const TradeType = {
  Buy: "BUY",
  Sell: "SELL",
} as const;

export const BondingCurveType = {
  APE: "APE",
  UNISWAP: "UNISWAP",
} as const;
