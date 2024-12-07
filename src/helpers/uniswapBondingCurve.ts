import { BigDecimal } from "generated";
import type { Address } from "../types";
import { framework, fromHex } from "../utils";
import { ONE_ETHER_DECIMAL, TOKEN_TOTAL_SUPPLY_DECIMAL } from "./constants";


export async function fetchUniswapBondingCurveDetails(
  bondingCurveAddress: Address,
  chainId: number,
  blockNumber?: bigint // New optional parameter
) {
  const client = framework.getClient(chainId);
  const bondingCurve = framework.getUniswapBondingCurveContract(bondingCurveAddress);

  // Create a base contract call object
  const baseCall = {
    ...bondingCurve,
    blockNumber: blockNumber, // Include blockNumber in each call
  };

  try {
    const results = await client.multicall({
      allowFailure: false,
      contracts: [
        { ...baseCall, functionName: "VIRTUAL_ETH_RESERVE", args: [] },
        { ...baseCall, functionName: "VIRTUAL_TOKEN_RESERVE", args: [] },
        { ...baseCall, functionName: "ethReserve", args: [] },
        { ...baseCall, functionName: "tokenReserve", args: [] },
        { ...baseCall, functionName: "uniswapRouter", args: [] },
        { ...baseCall, functionName: "remainingEthToCompleteCurve", args: [] },
        { ...baseCall, functionName: "TOTAL_ETH_TO_COMPLETE_CURVE", args: [] },
      ],
    });

    const entry = {
      virtualEthReserve: results[0].toString() || "",
      virtualTokenReserve: results[1].toString() || "",
      ethReserve: results[2].toString() || "",
      tokenReserve: results[3].toString() || "",
      uniswapRouter: results[4].toString() || "",
      remainingEthToCompleteCurve: results[5].toString() || "",
      totalEthToCompleteCurve: results[6].toString() || "",
    } as const;

    return {
      virtualEthReserve: new BigDecimal(entry.virtualEthReserve).div(ONE_ETHER_DECIMAL),
      virtualTokenReserve: new BigDecimal(entry.virtualTokenReserve).div(ONE_ETHER_DECIMAL),
      ethReserve: new BigDecimal(entry.ethReserve).div(ONE_ETHER_DECIMAL),
      tokenReserve: new BigDecimal(entry.tokenReserve).div(ONE_ETHER_DECIMAL),
      uniswapRouter: entry.uniswapRouter,
      remainingEthToCompleteCurve: new BigDecimal(entry.remainingEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
      totalEthToCompleteCurve: new BigDecimal(entry.totalEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
    };
  } catch (_error) {
    try {
      const [
        virtualEthReserve,
        virtualTokenReserve,
        ethReserve,
        tokenReserve,
        uniswapRouter,
        remainingEthToCompleteCurve,
        totalEthToCompleteCurve,
      ] = await Promise.all([
        client.readContract({ ...baseCall, functionName: "VIRTUAL_ETH_RESERVE", args: [] }),
        client.readContract({ ...baseCall, functionName: "VIRTUAL_TOKEN_RESERVE", args: [] }),
        client.readContract({ ...baseCall, functionName: "ethReserve", args: [] }),
        client.readContract({ ...baseCall, functionName: "tokenReserve", args: [] }),
        client.readContract({ ...baseCall, functionName: "uniswapRouter", args: [] }),
        client.readContract({ ...baseCall, functionName: "remainingEthToCompleteCurve", args: [] }),
        client.readContract({ ...baseCall, functionName: "TOTAL_ETH_TO_COMPLETE_CURVE", args: [] }),
      ]);

      if (
        typeof virtualEthReserve === "bigint" &&
        typeof virtualTokenReserve === "bigint" &&
        typeof ethReserve === "bigint" &&
        typeof tokenReserve === "bigint" &&
        typeof uniswapRouter === "string" &&
        typeof remainingEthToCompleteCurve === "bigint" &&
        typeof totalEthToCompleteCurve === "bigint"
      ) {
        return {
          virtualEthReserve: new BigDecimal(virtualEthReserve).div(ONE_ETHER_DECIMAL),
          virtualTokenReserve: new BigDecimal(virtualTokenReserve).div(ONE_ETHER_DECIMAL),
          ethReserve: new BigDecimal(ethReserve).div(ONE_ETHER_DECIMAL),
          tokenReserve: new BigDecimal(tokenReserve).div(ONE_ETHER_DECIMAL),
          uniswapRouter: uniswapRouter,
          remainingEthToCompleteCurve: new BigDecimal(remainingEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
          totalEthToCompleteCurve: new BigDecimal(totalEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
        };
      } else {
        console.log("Unexpected types in individual call results");
        return null;
      }
    } catch (individualError) {
      console.log("Individual calls failed:", individualError);
      return null;
    }
  }
}