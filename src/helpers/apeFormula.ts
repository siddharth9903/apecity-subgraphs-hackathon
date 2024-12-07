import { BigDecimal } from "generated"
import { ONE_ETHER_DECIMAL } from "./constants";

const MAX_WEIGHT = new BigDecimal(1000000);

export function estimateEthInForExactTokensOut(_supply: BigDecimal, _connectorBalance: BigDecimal, _connectorWeight: BigInt, _tokenAmountOut: BigInt) {
    const supply = _supply.multipliedBy(ONE_ETHER_DECIMAL);
    const connectorBalance = _connectorBalance.multipliedBy(ONE_ETHER_DECIMAL); 
    const connectorWeight = new BigDecimal(_connectorWeight.toString()); 
    const tokenAmountOut = new BigDecimal(_tokenAmountOut.toString()).multipliedBy(ONE_ETHER_DECIMAL);

    if (supply.lte(0) || connectorBalance.lte(0) || connectorWeight.lte(0) || connectorWeight.gt(MAX_WEIGHT) || tokenAmountOut.eq(0)) {
        return new BigDecimal(0);
    }

    if (connectorWeight.eq(MAX_WEIGHT)) {
        return tokenAmountOut.multipliedBy(connectorBalance).div(supply).div(ONE_ETHER_DECIMAL);
    }

    const base = (tokenAmountOut.plus(supply)).dividedBy(supply);
    const exp = MAX_WEIGHT.div(connectorWeight);
    const result = base.pow(exp);
    const estimatedEthIn = connectorBalance.multipliedBy(result).minus(connectorBalance);
    return estimatedEthIn.dividedBy(ONE_ETHER_DECIMAL)
}
