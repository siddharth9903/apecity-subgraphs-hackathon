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
      "https://base-rpc.publicnode.com",
    ],
  },
  { //polygon
    id: 137,
    rpcEndpoints: [
      "https://polygon.llamarpc.com",
    ],
  },
];
