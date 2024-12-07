import type { Address, Event } from "../types";

export function generateFactoryIdFromAddress(
  event: Event,
  factoryAddress: string
) {
  return "".concat(factoryAddress).concat("-").concat(event.chainId.toString());
}

export function generateFactoryIdFromEvent(event: Event) {
  return generateFactoryIdFromAddress(event, event.srcAddress);
}

export function generateTokenId(event: Event, tokenAddress: Address) {
  return ""
    .concat(tokenAddress.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString());
}

export function generateBondingCurveId(
  event: Event,
  bondingCurveAddress: Address
) {
  return ""
    .concat(bondingCurveAddress.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString());
}

export function generateUserId(address: Address) {
  return "".concat(address);
}

export function generateTransactionId(event: Event) {
  return ""
    .concat(event.transaction.hash)
    .concat("-")
    .concat(event.chainId.toString());
}

export function generateMetadataId(event: Event, contentHash: string) {
  return "".concat(contentHash).concat("-").concat(event.chainId.toString());
}

export function generateTradeId(
    bondingCurveId: string,
    txCount: string
  ) {
    return ""
      .concat(bondingCurveId)
      .concat("-")
      .concat(txCount)
  }
