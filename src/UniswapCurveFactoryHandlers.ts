// /*
//  * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
//  */
// import {
//   BigDecimal,
//   Factory,
// //   UniswapCurveFactoryContract,
//   Token,
//   Transaction,
//   User,
// } from "generated";
// import {
//   generateBondingCurveId,
//   generateFactoryIdFromEvent,
//   generateMetadataId,
//   generateTokenId,
//   generateTransactionId,
//   generateUserId,
// } from "./helpers/generateIds";
// import { fetchTokenDetails, fetchTokenMetadata } from "./helpers/token";
// import { getTransactionDetails } from "./helpers/transaction";
// // import { BondingCurve, TokenMetadata } from "generated/src/Types.gen";
// import { Address, BondingCurveType } from "./types";
// import {
//   ONE_ETHER_DECIMAL,
//   TOKEN_TOTAL_SUPPLY_DECIMAL,
// } from "./helpers/constants";
// import { fetchUniswapBondingCurveDetails } from "./helpers/uniswapBondingCurve";

// // UniswapCurveFactoryContract.TokenCreated.handler(async ({ event, context }) => {
// //   let factoryId = generateFactoryIdFromEvent(event);
// //   let existingFactory = await context.Factory.get(factoryId);

// //   if (existingFactory == undefined) {
// //     const factoryEntity: Factory = {
// //       id: factoryId,
// //       chainId: event.chainId,
// //       curveType: BondingCurveType.UNISWAP,
// //       address: event.srcAddress,
// //       tokenCount: 1,
// //       bondingCurveCount: 1,
// //       txCount: 0n,
// //     };
// //     context.Factory.set(factoryEntity);
// //   } else {
// //     const factoryEntity: Factory = {
// //       ...existingFactory,
// //       tokenCount: existingFactory.tokenCount + 1,
// //       bondingCurveCount: existingFactory.bondingCurveCount + 1,
// //     };

// //     context.Factory.set(factoryEntity);
// //   }

// //   let tokenAddress = event.params.token;
// //   let bondingCurveAddress = event.params.bondingCurve;

// //   let tokenId = generateTokenId(event, tokenAddress as Address);
// //   let bondingCurveId = generateBondingCurveId(
// //     event,
// //     bondingCurveAddress as Address
// //   );

// //   let transactionId = generateTransactionId(event);
// //   let transactionEntity: Transaction = {
// //     hash: event.transaction.hash,
// //     blockNumber: BigInt(event.block.number),
// //     chainId: event.chainId,
// //     id: transactionId,
// //     timestamp: BigInt(event.block.timestamp),
// //     tokenCreationTx: true,
// //     trade_id: undefined,
// //   };
// //   context.Transaction.set(transactionEntity);

// //   let txDetails = await getTransactionDetails(event);

// //   let userAddress = txDetails.from;
// //   let userId = generateUserId(userAddress);
// //   let existingUser = await context.User.get(userId);

// //   if (existingUser == undefined) {
// //     let userEntity: User = {
// //       address: userAddress,
// //       id: userId,
// //     };
// //     context.User.set(userEntity);
// //   }

// //   const { decimals, name, symbol, totalSupply, tokenURI } =
// //     await fetchTokenDetails(tokenAddress as Address, event.chainId);

// //   const tokenMetadataId = generateMetadataId(event, tokenURI);

// //   const tokenMetadata = await handleTokenMetadata(tokenMetadataId, tokenURI);
// //   if (tokenMetadata) {
// //     context.TokenMetadata.set(tokenMetadata);
// //   }

// //   let tokenEntity: Token = {
// //     id: tokenId,
// //     chainId: event.chainId,
// //     curveType: BondingCurveType.UNISWAP,
// //     address: tokenAddress,

// //     symbol: symbol,
// //     name: name,
// //     decimals: BigInt(decimals || 0),
// //     tokenURI: tokenURI,
// //     totalSupply: BigInt(totalSupply || 0),

// //     metadata_id: tokenMetadata ? tokenMetadata.id : undefined,

// //     timestamp: BigInt(event.block.timestamp),

// //     bondingCurve_id: bondingCurveId,
// //     factory_id: factoryId,

// //     creationTransaction_id: transactionId,
// //     creator_id: userId,
// //   };

// //   const bondingCurveDetails = await fetchUniswapBondingCurveDetails(
// //     bondingCurveAddress as Address,
// //     event.chainId
// //   );

// //   if (!bondingCurveDetails) {
// //     throw new Error("Could not fetch bonding curve data");
// //   }

// //   let currentPrice = bondingCurveDetails.virtualEthReserve.div(
// //     bondingCurveDetails.virtualTokenReserve
// //   );
// //   let marketCap = currentPrice
// //     .multipliedBy(TOKEN_TOTAL_SUPPLY_DECIMAL)
// //     .div(ONE_ETHER_DECIMAL);

// //   let bondingCurveEntity: BondingCurve = {
// //     id: bondingCurveId,
// //     active: true,
// //     address: bondingCurveAddress,
// //     chainId: event.chainId,

// //     curveType: BondingCurveType.UNISWAP,

// //     //Not useful but is there due to schema merge
// //     circulatingSupply: BigDecimal(0),
// //     reserveRatio: BigInt(0),

// //     blockNumber: BigInt(event.block.number),
// //     timestamp: BigInt(event.block.timestamp),

// //     creationTransaction_id: transactionId,
// //     creator_id: userId,
// //     factory_id: factoryId,
// //     token_id: tokenId,

// //     currentPrice: currentPrice,
// //     marketCap: marketCap,

// //     virtualEthReserve: bondingCurveDetails.virtualEthReserve,
// //     virtualTokenReserve: bondingCurveDetails.virtualTokenReserve,

// //     ethReserve: bondingCurveDetails.ethReserve,
// //     tokenReserve: bondingCurveDetails.tokenReserve,

// //     ethAmountToCompleteCurve: bondingCurveDetails.totalEthToCompleteCurve, //it'll be updated in buy handler, if user bought
// //     totalEthAmountToCompleteCurve: bondingCurveDetails.totalEthToCompleteCurve,

// //     lpCreationTimestamp: undefined,
// //     uniswapLiquidityPool: undefined,
// //     uniswapRouter: bondingCurveDetails.uniswapRouter,

// //     volume: new BigDecimal(0),
// //     buyVolume: new BigDecimal(0),
// //     sellVolume: new BigDecimal(0),
// //     lastActivity: BigInt(event.block.timestamp),
// //     txCount: 0n,
// //   };

// //   context.Token.set(tokenEntity);
// //   context.BondingCurve.set(bondingCurveEntity);
// // });

// // UniswapCurveFactoryContract.TokenCreated.contractRegister(
// //   ({ event, context }) => {
// //     context.addUniswapBondingCurveContract(event.params.bondingCurve);
// //   }
// // );

// async function handleTokenMetadata(
//   tokenMetadataId: string,
//   tokenURI: string
// ): Promise<TokenMetadata | null> {
//   const fetchedTokenMetadata = await fetchTokenMetadata(tokenURI);

//   if (!fetchedTokenMetadata) {
//     console.log("Failed to fetch token metadata for URI:", tokenURI);
//     return null;
//   }

//   const tokenMetadataEntity: TokenMetadata = {
//     id: tokenMetadataId,
//     name: fetchedTokenMetadata.name ?? "Unknown",
//     description: fetchedTokenMetadata.description ?? "",
//     symbol: fetchedTokenMetadata.symbol ?? "",
//     image: fetchedTokenMetadata.image ?? "",
//     twitter: fetchedTokenMetadata.twitter ?? "",
//     telegram: fetchedTokenMetadata.telegram ?? "",
//     website: fetchedTokenMetadata.website ?? "",
//     contentHash: tokenURI,
//   };

//   return tokenMetadataEntity;
// }
