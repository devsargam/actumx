import { Connection, PublicKey } from "@solana/web3.js";

import { env, isDev } from "../config/env";

const LAMPORTS_PER_SOL = 1_000_000_000;

const rpcUrl = isDev ? env.SOLANA_RPC_URL_LOCAL : env.SOLANA_RPC_URL;
const connection = new Connection(rpcUrl, "confirmed");

export type SolanaBalance = {
  balanceLamports: number | null;
  balanceSol: number | null;
  error: string | null;
};

export abstract class SolanaBalanceService {
  static async getBalance(publicKeyBase58: string): Promise<SolanaBalance> {
    try {
      const lamports = await connection.getBalance(new PublicKey(publicKeyBase58));
      return {
        balanceLamports: lamports,
        balanceSol: lamports / LAMPORTS_PER_SOL,
        error: null,
      };
    } catch {
      return {
        balanceLamports: null,
        balanceSol: null,
        error: "balance_unavailable",
      };
    }
  }
}
