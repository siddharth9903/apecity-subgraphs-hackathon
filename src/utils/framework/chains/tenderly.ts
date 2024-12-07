import { defineChain } from "viem";

export const tenderlyRpc = "https://virtual.base.rpc.tenderly.co/b24b9e70-286b-446d-9bd5-a728627d463c";

export const tenderlyChain = defineChain({
    id: 8454,
    name: "tenderly-base",
    network: "tenderly",
    nativeCurrency: {
        name: "Eth",
        symbol: "ETH",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [tenderlyRpc],
        },
        public: {
            http: [tenderlyRpc],
        }
    }
})