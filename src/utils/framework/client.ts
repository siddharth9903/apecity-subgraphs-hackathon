import { createPublicClient, http, fallback } from "viem";
import { fallbacks } from "./rpc";
import { base, polygon } from "viem/chains";
import { tenderlyChain } from "./chains/tenderly";

const supported = [
    tenderlyChain,
    polygon,
    base,
]

const clients = supported.map((chain) =>
  createPublicClient({
    batch: {
      multicall: true,
    },
    chain,
    transport: fallback(
      fallbacks
        .find((f) => f.id === chain?.id)
        ?.rpcEndpoints.map((e) => http(e)) || [],
      {
        rank: false,
        retryCount: 5,
      },
    ),
  }),
);

export function getClient(chainId: number | string | bigint) {
  const client = clients.find(
    (c) => c.chain.id.toString() === chainId.toString(),
  );

  if (!client) {
    throw new Error(`Client missing from configuration for chain: ${chainId}`);
  }

  return client;
}