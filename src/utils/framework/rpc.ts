/**
 *
 * Fallback RPCs (only public endpoints at the moment)
 * Use Infura/Alchemy in production once ENV vars are enabled on Envio
 *
 */

export const fallbacks: { id: number; rpcEndpoints: string[] }[] = [
  {//basefork
    id: 8454,
    rpcEndpoints: [
      "https://virtual.base.rpc.tenderly.co/b24b9e70-286b-446d-9bd5-a728627d463c",
    ],
  },
  { //base
    id: 8453,
    rpcEndpoints: [
      "https://base.gateway.tenderly.co/7eSxf2jVQXhRN3QZ4bRkBj",
    ],
  },
  { //polygon
    id: 1284,
    rpcEndpoints: [
      "https://moonbeam.gateway.tenderly.co/46qa4Ie57g8F56TUSbdabt",
    ],
  },
];
