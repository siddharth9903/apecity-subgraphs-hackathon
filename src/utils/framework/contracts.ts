import { Address } from "../../types/index";
import ApeCurveFactoryAbi from "../../../abis/ApeCurveFactory.json";
import ApeBondingCurveAbi from "../../../abis/ApeBondingCurve.json";
import UniswapCurveFactoryAbi from "../../../abis/UniswapCurveFactory.json";
import UniswapBondingCurveAbi from "../../../abis/UniswapBondingCurve.json";
import ERC20FixedSupplyABI from "../../../abis/ERC20FixedSupply.json";

export function getApeCurveFactoryContract(address: Address) {
  return { address: address as `0x${string}`, abi: ApeCurveFactoryAbi as any };
}

export function getApeBondingCurveContract(address: Address) {
  return { address: address as `0x${string}`, abi: ApeBondingCurveAbi as any };
}

export function getUniswapCurveFactoryContract(address: Address) {
  return {
    address: address as `0x${string}`,
    abi: UniswapCurveFactoryAbi as any,
  };
}

export function getUniswapBondingCurveContract(address: Address) {
  return {
    address: address as `0x${string}`,
    abi: UniswapBondingCurveAbi as any,
  };
}

export function getERC20Contract(address: Address) {
  return { address: address as `0x${string}`, abi: ERC20FixedSupplyABI as any };
}
