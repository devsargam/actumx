import { eq, sql } from "drizzle-orm";

import { db } from "../db/client";
import { creditLedger } from "../db/schema";

export abstract class CreditsService {
  static async computeBalanceCents(userId: string): Promise<number> {
    const [result] = await db
      .select({
        balanceCents: sql<number>`COALESCE(SUM(CASE WHEN ${creditLedger.direction} = 'credit' THEN ${creditLedger.amountCents} ELSE -${creditLedger.amountCents} END), 0)`,
      })
      .from(creditLedger)
      .where(eq(creditLedger.userId, userId));

    return result?.balanceCents ?? 0;
  }
}
