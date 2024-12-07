import type { Address, Event } from "../types";
import { framework, fromHex } from "../utils";

export async function getTransactionDetailsFromRpc(event: Event) {
  const client = framework.getClient(event.chainId);
  const txHash = event.transaction.hash;
  const transaction = await client.getTransaction({
    hash: txHash as `0x${string}`,
  });

  if (transaction) {
    return {
      from: transaction.from,
      to: transaction.to,
      input: transaction.input,
      blockNumber: transaction.blockNumber,
      hash: transaction.hash,
    };
  } else {
    return null;
  }
}

export async function getTransactionDetails(event: Event) {
  if (
    event.transaction &&
    "from" in event.transaction &&
    "to" in event.transaction
  ) {
    return {
      from: event.transaction.from as Address,
      to: event.transaction.to as Address,
      hash: event.transaction.hash,
      blockNumber: event.block.number,
    };
  } else {
    let tx = await getTransactionDetailsFromRpc(event);

    if (!tx) {
      throw new Error("Tx fetching from RPC failing");
    }

    return {
      from: tx.from as Address,
      to: tx.to as Address,
      hash: event.transaction.hash,
      blockNumber: event.block.number,
    };
  }
}
