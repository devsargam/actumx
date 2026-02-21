import { desc, eq } from "drizzle-orm";
import { Keypair } from "@solana/web3.js";

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
}
