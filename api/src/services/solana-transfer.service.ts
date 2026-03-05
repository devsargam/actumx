import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import { env } from "../config/env";

const connection = new Connection(env.SOLANA_RPC_URL, "confirmed");

function detectExplorerClusterParam() {
  const rpc = env.SOLANA_RPC_URL.toLowerCase();
  if (rpc.includes("devnet")) {
    return "devnet";
  }
  if (rpc.includes("testnet")) {
    return "testnet";
  }
  return null;
}

type TransferInput = {
  fromPrivateKeyBase64: string;
  toPublicKeyBase58: string;
  amountSol: number;
};

type TransferResult = {
  fromPublicKey: string;
  toPublicKey: string;
  amountSol: number;
  lamports: number;
  signature: string;
};

export abstract class SolanaTransferService {
  static getExplorerTxUrl(signature: string): string {
    const cluster = detectExplorerClusterParam();
    const query = cluster ? `?cluster=${cluster}` : "";
    return `https://explorer.solana.com/tx/${signature}${query}`;
  }

  static async transferSol(input: TransferInput): Promise<TransferResult> {
    if (!Number.isFinite(input.amountSol) || input.amountSol <= 0) {
      throw new Error("amountSol must be a positive number");
    }

    const lamports = Math.floor(input.amountSol * LAMPORTS_PER_SOL);
    if (lamports <= 0) {
      throw new Error("amountSol is too small");
    }

    const fromSecretKey = Buffer.from(input.fromPrivateKeyBase64, "base64");
    const fromKeypair = Keypair.fromSecretKey(Uint8Array.from(fromSecretKey));
    const toPublicKey = new PublicKey(input.toPublicKeyBase58);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair],
      { commitment: "confirmed" }
    );

    return {
      fromPublicKey: fromKeypair.publicKey.toBase58(),
      toPublicKey: toPublicKey.toBase58(),
      amountSol: lamports / LAMPORTS_PER_SOL,
      lamports,
      signature,
    };
  }
}
