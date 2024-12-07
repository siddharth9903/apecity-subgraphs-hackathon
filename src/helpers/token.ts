import type { Address } from "../types";
import { framework, fromHex } from "../utils";
import { TryFetchIpfsFile } from "../utils/ipfs";

interface TokenMetadata {
  name?: string;
  description?: string;
  symbol?: string;
  image?: string;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export async function fetchTokenDetails(
  tokenAddress: Address,
  chainId: number
) {
  const client = framework.getClient(chainId);
  const erc20 = framework.getERC20Contract(tokenAddress);

  try {
    const results = await client.multicall({
      allowFailure: false,
      contracts: [
        {
          ...erc20,
          functionName: "decimals",
          args: [],
        },
        {
          ...erc20,
          functionName: "name",
          args: [],
        },
        {
          ...erc20,
          functionName: "symbol",
          args: [],
        },
        {
          ...erc20,
          functionName: "totalSupply",
          args: [],
        },
        {
          ...erc20,
          functionName: "tokenURI",
          args: [],
        },
      ],
    });

    const entry = {
      decimals: results[0].toString() || "",
      name: results[1].toString() || "",
      symbol: results[2].toString() || "",
      totalSupply: results[3].toString() || "",
      tokenURI: results[4].toString() || "",
    } as const;

    return {
      decimals: BigInt(entry.decimals || 0),
      name: entry.name,
      symbol: entry.symbol,
      totalSupply: BigInt(entry.decimals || 10 ** 9),
      tokenURI: entry.tokenURI,
    };
  } catch (_error) {
    console.log("error: ", _error);
    try {
      const [decimals, name, symbol, totalSupply, tokenURI] = await Promise.all(
        [
          client
            .readContract({
              ...erc20,
              functionName: "decimals",
              args: [],
            })
            .catch(() => 18),
          client
            .readContract({
              ...erc20,
              functionName: "name",
              args: [],
            })
            .catch(() => tokenAddress),
          client
            .readContract({
              ...erc20,
              functionName: "symbol",
              args: [],
            })
            .catch(() => tokenAddress),
          client
            .readContract({
              ...erc20,
              functionName: "totalSupply",
              args: [],
            })
            .catch(() => 10n ** 9n),
          client
            .readContract({
              ...erc20,
              functionName: "tokenURI",
              args: [],
            })
            .catch(() => ""),
        ]
      );

      return {
        decimals: typeof decimals === "number" ? BigInt(decimals) : 18n,
        name: typeof name === "string" ? name : tokenAddress,
        symbol: typeof symbol === "string" ? symbol : tokenAddress,
        totalSupply: typeof totalSupply === "bigint" ? totalSupply : 10n ** 9n,
        tokenURI: typeof tokenURI === "string" ? tokenURI : "",
      };
    } catch (individualError) {
      console.log("Individual calls failed:", individualError);
      return {
        decimals: 18n,
        symbol: tokenAddress,
        name: tokenAddress,
        totalSupply: 10n ** 9n,
        tokenURI: "",
      };
    }
  }
}

export async function fetchTokenMetadata(
  hash: string
): Promise<TokenMetadata | null> {
  try {
    const responseJson = await TryFetchIpfsFile(hash);

    if (!responseJson || typeof responseJson !== "object") {
      console.log("Failed to parse token metadata of ipfs hash", hash);
      return null;
    }

    // Type assertion to treat responseJson as a record with string keys
    const jsonData = responseJson as Record<string, unknown>;

    const metadata: TokenMetadata = {};

    // Check and assign each property if it exists and is a string
    if (typeof jsonData.name === "string") metadata.name = jsonData.name;
    if (typeof jsonData.description === "string")
      metadata.description = jsonData.description;
    if (typeof jsonData.symbol === "string") metadata.symbol = jsonData.symbol;
    if (typeof jsonData.image === "string") metadata.image = jsonData.image;
    if (typeof jsonData.twitter === "string")
      metadata.twitter = jsonData.twitter;
    if (typeof jsonData.telegram === "string")
      metadata.telegram = jsonData.telegram;
    if (typeof jsonData.website === "string")
      metadata.website = jsonData.website;

    return metadata;
  } catch (individualError) {
    console.log("Failed to fetch token metadata of ipfs hash", hash);
    return null;
  }
}
