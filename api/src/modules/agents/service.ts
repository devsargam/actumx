import { and, desc, eq } from "drizzle-orm";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { db } from "../../db/client";
import { agents } from "../../db/schema";
import { newId } from "../../lib/crypto";
import { AuthContextService } from "../../services/auth-context.service";
import { SolanaBalanceService } from "../../services/solana-balance.service";
import { TimeService } from "../../services/time.service";
import type { AgentsModel } from "./model";

export abstract class AgentsService {
  static async list(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const wallets = await db
      .select({
        id: agents.id,
        name: agents.name,
        publicKey: agents.publicKey,
        createdAt: agents.createdAt,
      })
      .from(agents)
      .where(eq(agents.userId, auth.user.id))
      .orderBy(desc(agents.createdAt));

    const withBalances = await Promise.all(
      wallets.map(async (wallet) => {
        const balance = await SolanaBalanceService.getBalance(wallet.publicKey);
        return { ...wallet, ...balance };
      })
    );

    return { statusCode: 200, body: { agents: withBalances } };
  }

  static async create(request: Request, payload: AgentsModel.CreateAgentBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const wallet = Keypair.generate();
    const publicKey = wallet.publicKey.toBase58();
    const privateKeyBase64 = Buffer.from(wallet.secretKey).toString("base64");
    const id = newId("agent");
    const createdAt = TimeService.nowIso();

    await db.insert(agents).values({
      id,
      userId: auth.user.id,
      name: payload.name,
      publicKey,
      privateKey: privateKeyBase64,
      createdAt,
    });

    const balance = await SolanaBalanceService.getBalance(publicKey);

    return {
      statusCode: 200,
      body: {
        agentId: id,
        name: payload.name,
        publicKey,
        privateKey: privateKeyBase64,
        createdAt,
        ...balance,
        warning: "Store this private key now. It is shown only once.",
      },
    };
  }

  static async fundDevnet(request: Request, agentId: string, payload: AgentsModel.FundDevnetBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [agent] = await db
      .select({
        id: agents.id,
        publicKey: agents.publicKey,
      })
      .from(agents)
      .where(and(eq(agents.id, agentId), eq(agents.userId, auth.user.id)))
      .limit(1);

    if (!agent) {
      return { statusCode: 404, body: { error: "agent not found" } };
    }

    try {
      const amountSol = payload.amountSol ?? 1;
      const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const publicKey = new PublicKey(agent.publicKey);

      const signature = await connection.requestAirdrop(publicKey, lamports);
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );

      const balance = await SolanaBalanceService.getBalance(agent.publicKey);

      return {
        statusCode: 200,
        body: {
          agentId: agent.id,
          network: "solana-devnet",
          amountSol,
          signature,
          explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
          publicKey: agent.publicKey,
          ...balance,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "failed to fund agent on devnet";
      return {
        statusCode: 400,
        body: { error: message },
      };
    }
  }
}
