import {
  getApeCurveFactoryContract,
  getApeBondingCurveContract,
  getUniswapCurveFactoryContract,
  getUniswapBondingCurveContract,
  getERC20Contract,
} from "./contracts";
import { getClient } from "./client";

export const framework = {
  getClient,
  getERC20Contract,
  getApeCurveFactoryContract,
  getApeBondingCurveContract,
  getUniswapCurveFactoryContract,
  getUniswapBondingCurveContract,
};
