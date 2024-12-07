/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { BigDecimal, ApeBondingCurveContract, User } from "generated";
// import {
//   generateBondingCurveId,
//   generateTradeId,
//   generateTransactionId,
//   generateUserId,
// } from "./helpers/generateIds";
// import {
//   BondingCurve,
//   Factory,
//   Trade,
//   Transaction,
// } from "generated/src/Types.gen";
import {
  ONE_ETHER_DECIMAL,
  TOKEN_TOTAL_SUPPLY_DECIMAL,
} from "./helpers/constants";
import { fetchApeBondingCurveDetails } from "./helpers/apeBondingCurve";
import { Address, TradeType } from "./types";
import { estimateEthInForExactTokensOut } from "./helpers/apeFormula";

// ApeBondingCurveContract.LogBuy.handler(async ({ event, context }) => {
//     console.log('event.params',event.params)
//   let _inAmount = BigDecimal(event.params.totalCost.toString()).div(
//     ONE_ETHER_DECIMAL
//   );
//   let _outAmount = BigDecimal(event.params.amountBought.toString()).div(
//     ONE_ETHER_DECIMAL
//   );

//   let userAddress = event.params.buyer;
//   let userId = generateUserId(userAddress as Address);
//   let user = await context.User.get(userId);

//   if (user == undefined) {
//     let userEntity: User = {
//       address: userAddress,
//       id: userId,
//     };
//     context.User.set(userEntity);
//   }

//   let bondingCurveAddress = event.srcAddress;
//   let bondingCurveId = generateBondingCurveId(
//     event,
//     bondingCurveAddress as Address
//   );
//   let bondingCurve = await context.BondingCurve.get(bondingCurveId);
//   if (!bondingCurve) {
//     throw new Error(`Couldn't find bonding curve of id:  ${bondingCurveId}`);
//   }

//   let factoryId = bondingCurve.factory_id;
//   let factory = await context.Factory.get(factoryId);
//   if (!factory) {
//     throw new Error(`Couldn't find factory of id:  ${factoryId}`);
//   }

//   let tokenId = bondingCurve.token_id;
//   let token = await context.Token.get(tokenId);
//   if (!token) {
//     throw new Error(`Couldn't find token of id:  ${tokenId}`);
//   }

//   const bondingCurveDetails = await fetchApeBondingCurveDetails(
//     bondingCurveAddress as Address,
//     event.chainId,
//     BigInt(event.block.number)
//   );

//   if (!bondingCurveDetails) {
//     throw new Error("Could not fetch bonding curve data");
//   }

//   let currentPrice = estimateEthInForExactTokensOut(
//     bondingCurveDetails.circulatingSupply,
//     bondingCurveDetails.ethReserve,
//     BigInt(bondingCurveDetails.reserveRatio),
//     BigInt(1)
//   );

//   let marketCap = currentPrice.multipliedBy(TOKEN_TOTAL_SUPPLY_DECIMAL);

//   let updatedBondingCurve: BondingCurve = {
//     ...bondingCurve,
//     ethReserve: bondingCurveDetails.ethReserve,
//     circulatingSupply: bondingCurveDetails.circulatingSupply,
//     currentPrice: currentPrice,
//     marketCap: marketCap,
//     ethAmountToCompleteCurve: bondingCurveDetails.remainingEthToCompleteCurve,
//     volume: bondingCurve.volume.plus(_inAmount),
//     buyVolume: bondingCurve.buyVolume.plus(_inAmount),
//     lastActivity: BigInt(event.block.timestamp),
//     txCount: bondingCurve.txCount + 1n,
//   };
//   context.BondingCurve.set(updatedBondingCurve);

//   let updatedFactory: Factory = {
//     ...factory,
//     txCount: factory.txCount + 1n,
//   };
//   context.Factory.set(updatedFactory);

//   let tradeId = generateTradeId(
//     bondingCurve.id,
//     bondingCurve.txCount.toString()
//   );

//   let transactionId = generateTransactionId(event);
//   let transactionEntity: Transaction = {
//     hash: event.transaction.hash,
//     blockNumber: BigInt(event.block.number),
//     chainId: event.chainId,
//     id: transactionId,
//     timestamp: BigInt(event.block.timestamp),
//     tokenCreationTx: false,
//     trade_id: tradeId,
//   };

//   context.Transaction.set(transactionEntity);

//   let trade: Trade = {
//     id: tradeId,
//     chainId: event.chainId,
//     transaction_id: transactionId,
//     timestamp: BigInt(event.block.timestamp),
//     bondingCurve_id: bondingCurveId,

//     tradeType: TradeType.Buy,
//     user_id: userId,

//     inAmount: _inAmount,
//     outAmount: _outAmount,

//     openPrice: bondingCurve.currentPrice,
//     closePrice: updatedBondingCurve.currentPrice,
//     avgPrice: updatedBondingCurve.currentPrice
//       .minus(bondingCurve.currentPrice)
//       .div(2),
//   };

//   context.Trade.set(trade);
// });

// ApeBondingCurveContract.LogSell.handler(async ({ event, context }) => {
//   let _inAmount = BigDecimal(event.params.amountSell.toString()).div(
//     ONE_ETHER_DECIMAL
//   );
//   let _outAmount = BigDecimal(event.params.reward.toString()).div(
//     ONE_ETHER_DECIMAL
//   );

//   let userAddress = event.params.seller;
//   let userId = generateUserId(userAddress as Address);
//   let user = await context.User.get(userId);

//   if (user == undefined) {
//     let userEntity: User = {
//       address: userAddress,
//       id: userId,
//     };
//     context.User.set(userEntity);
//   }

//   let bondingCurveAddress = event.srcAddress;
//   let bondingCurveId = generateBondingCurveId(
//     event,
//     bondingCurveAddress as Address
//   );
//   let bondingCurve = await context.BondingCurve.get(bondingCurveId);
//   if (!bondingCurve) {
//     throw new Error(`Couldn't find bonding curve of id:  ${bondingCurveId}`);
//   }
//   let openPrice = bondingCurve.currentPrice;

//   let factoryId = bondingCurve.factory_id;
//   let factory = await context.Factory.get(factoryId);
//   if (!factory) {
//     throw new Error(`Couldn't find factory of id:  ${factoryId}`);
//   }

//   let tokenId = bondingCurve.token_id;
//   let token = await context.Token.get(tokenId);
//   if (!token) {
//     throw new Error(`Couldn't find token of id:  ${tokenId}`);
//   }

//   const bondingCurveDetails = await fetchApeBondingCurveDetails(
//     bondingCurveAddress as Address,
//     event.chainId,
//     BigInt(event.block.number)
//   );

//   if (!bondingCurveDetails) {
//     throw new Error("Could not fetch bonding curve data");
//   }

//   let currentPrice = estimateEthInForExactTokensOut(
//     bondingCurveDetails.circulatingSupply,
//     bondingCurveDetails.ethReserve,
//     BigInt(bondingCurveDetails.reserveRatio),
//     BigInt(1)
//   );

//   let marketCap = currentPrice.multipliedBy(TOKEN_TOTAL_SUPPLY_DECIMAL);

//   let updatedBondingCurve: BondingCurve = {
//     ...bondingCurve,
//     ethReserve: bondingCurveDetails.ethReserve,
//     circulatingSupply: bondingCurveDetails.circulatingSupply,
//     currentPrice: currentPrice,
//     marketCap: marketCap,
//     ethAmountToCompleteCurve: bondingCurveDetails.remainingEthToCompleteCurve,
//     volume: bondingCurve.volume.plus(_outAmount),
//     sellVolume: bondingCurve.sellVolume.plus(_outAmount),
//     lastActivity: BigInt(event.block.timestamp),
//     txCount: bondingCurve.txCount + 1n,
//   };
//   context.BondingCurve.set(updatedBondingCurve);

//   let updatedFactory: Factory = {
//     ...factory,
//     txCount: factory.txCount + 1n,
//   };
//   context.Factory.set(updatedFactory);

//   let tradeId = generateTradeId(
//     bondingCurve.id,
//     bondingCurve.txCount.toString()
//   );

//   let transactionId = generateTransactionId(event);
//   let transactionEntity: Transaction = {
//     hash: event.transaction.hash,
//     blockNumber: BigInt(event.block.number),
//     chainId: event.chainId,
//     id: transactionId,
//     timestamp: BigInt(event.block.timestamp),
//     tokenCreationTx: false,
//     trade_id: tradeId,
//   };

//   context.Transaction.set(transactionEntity);

//   let trade: Trade = {
//     id: tradeId,
//     chainId: event.chainId,
//     transaction_id: transactionId,
//     timestamp: BigInt(event.block.timestamp),
//     bondingCurve_id: bondingCurveId,

//     tradeType: TradeType.Sell,
//     user_id: userId,

//     inAmount: _inAmount,
//     outAmount: _outAmount,

//     openPrice: bondingCurve.currentPrice,
//     closePrice: updatedBondingCurve.currentPrice,
//     avgPrice: bondingCurve.currentPrice
//       .minus(updatedBondingCurve.currentPrice)
//       .div(2),
//   };

//   context.Trade.set(trade);
// });

// ApeBondingCurveContract.BondingCurveComplete.handler(
//   async ({ event, context }) => {
//     let bondingCurveAddress = event.srcAddress;
//     let bondingCurveId = generateBondingCurveId(
//       event,
//       bondingCurveAddress as Address
//     );
//     let bondingCurve = await context.BondingCurve.get(bondingCurveId);

//     if (!bondingCurve) {
//       throw new Error(`Couldn't find bonding curve of id: ${bondingCurveId}`);
//     }

//     let updatedBondingCurve: BondingCurve = {
//       ...bondingCurve,
//       active: false,
//       uniswapLiquidityPool: event.params.liquidityPoolAddress,
//       lpCreationTimestamp: BigInt(event.block.timestamp),
//     };

//     context.BondingCurve.set(updatedBondingCurve);
//   }
// );

// ApeBondingCurveContract.LogBuy.handler(async ({ event, context }) => {});

// ApeBondingCurveContract.LogSell.handler(async ({ event, context }) => {});

// ApeBondingCurveContract.BondingCurveComplete.handler(
//   async ({ event, context }) => {}
// );

ApeBondingCurveContract.LogBuy.handler(async ({  }) => {});

ApeBondingCurveContract.LogSell.handler(async ({  }) => {});

ApeBondingCurveContract.BondingCurveComplete.handler(
  async ({  }) => {}
);



