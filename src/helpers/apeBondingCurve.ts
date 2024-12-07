import { BigDecimal } from "generated";
import type { Address } from "../types";
import { framework, fromHex } from "../utils";
import { ONE_ETHER_DECIMAL, TOKEN_TOTAL_SUPPLY_DECIMAL } from "./constants";


export async function fetchApeBondingCurveDetails(
  bondingCurveAddress: Address,
  chainId: number,
  blockNumber?: bigint // New optional parameter
) {
  const client = framework.getClient(chainId);
  const bondingCurve = framework.getApeBondingCurveContract(bondingCurveAddress);

  // Create a base contract call object
  const baseCall = {
    ...bondingCurve,
    blockNumber: blockNumber, // Include blockNumber in each call
  };

  try {
    const results = await client.multicall({
      allowFailure: false,
      contracts: [
        { ...baseCall, functionName: "ethReserve", args: [] },
        { ...baseCall, functionName: "reserveRatio", args: [] },
        { ...baseCall, functionName: "uniswapRouter", args: [] },
        { ...baseCall, functionName: "remainingEthToCompleteCurve", args: [] },
        { ...baseCall, functionName: "TOTAL_ETH_TO_COMPLETE_CURVE", args: [] },
        { ...baseCall, functionName: "getCirculatingSupply", args: [] },
      ],
    });

    const entry = {
      ethReserve: results[0].toString() || "",
      reserveRatio: results[1].toString() || "",
      uniswapRouter: results[2].toString() || "",
      remainingEthToCompleteCurve: results[3].toString() || "",
      totalEthToCompleteCurve: results[4].toString() || "",
      circulatingSupply: results[5].toString() || "",
    } as const;

    return {
      ethReserve: new BigDecimal(entry.ethReserve).div(ONE_ETHER_DECIMAL),
      reserveRatio: entry.reserveRatio,
      uniswapRouter: entry.uniswapRouter,
      remainingEthToCompleteCurve: new BigDecimal(entry.remainingEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
      totalEthToCompleteCurve: new BigDecimal(entry.totalEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
      circulatingSupply: new BigDecimal(entry.circulatingSupply).div(ONE_ETHER_DECIMAL),
    };

  } catch (_error) {
    try {
      const [
        ethReserve,
        reserveRatio,
        uniswapRouter,
        remainingEthToCompleteCurve,
        totalEthToCompleteCurve,
        circulatingSupply
      ] = await Promise.all([
        client.readContract({ ...baseCall, functionName: "ethReserve", args: [] }),
        client.readContract({ ...baseCall, functionName: "reserveRatio", args: [] }),
        client.readContract({ ...baseCall, functionName: "uniswapRouter", args: [] }),
        client.readContract({ ...baseCall, functionName: "remainingEthToCompleteCurve", args: [] }),
        client.readContract({ ...baseCall, functionName: "TOTAL_ETH_TO_COMPLETE_CURVE", args: [] }),
        client.readContract({ ...baseCall, functionName: "getCirculatingSupply", args: [] }),
      ]);

      if (
        typeof ethReserve === "bigint" &&
        typeof reserveRatio === "bigint" &&
        typeof uniswapRouter === "string" &&
        typeof remainingEthToCompleteCurve === "bigint" &&
        typeof totalEthToCompleteCurve === "bigint" &&
        typeof circulatingSupply === "bigint" 
      ) {
        return {
          ethReserve: new BigDecimal(ethReserve).div(ONE_ETHER_DECIMAL),
          reserveRatio: reserveRatio,
          uniswapRouter: uniswapRouter,
          remainingEthToCompleteCurve: new BigDecimal(remainingEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
          totalEthToCompleteCurve: new BigDecimal(totalEthToCompleteCurve).div(ONE_ETHER_DECIMAL),
          circulatingSupply: new BigDecimal(circulatingSupply).div(ONE_ETHER_DECIMAL),
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