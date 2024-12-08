import { defineChain } from "viem";

export const tenderlyRpc = "https://virtual.base.rpc.tenderly.co/910edb69-358e-4833-a39f-23b99d34b10b";

export const tenderlyChain = defineChain({
    id: 8454,
    name: "basefork",
    network: "basefork",
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