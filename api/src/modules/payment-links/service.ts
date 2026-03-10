import { and, desc, eq } from "drizzle-orm";

import { db } from "../../db/client";
import { paymentLinks } from "../../db/schema";
import { newId } from "../../lib/crypto";
import { AuthContextService } from "../../services/auth-context.service";
import { TimeService } from "../../services/time.service";
import type { PaymentLinksModel } from "./model";

export abstract class PaymentLinksService {
  static async list(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const rows = await db
      .select()
      .from(paymentLinks)
      .where(eq(paymentLinks.userId, auth.user.id))
      .orderBy(desc(paymentLinks.createdAt));

    return { statusCode: 200, body: { paymentLinks: rows } };
  }

  static async create(request: Request, payload: PaymentLinksModel.CreatePaymentLinkBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const id = newId("pl");
    const now = TimeService.nowIso();

    const row = {
      id,
      userId: auth.user.id,
      amountCents: payload.amountCents,
      description: payload.description ?? null,
      isReusable: payload.isReusable ? "true" : "false",
      createdAt: now,
    };

    await db.insert(paymentLinks).values(row);

    return { statusCode: 200, body: { paymentLink: row } };
  }

  static async delete(request: Request, linkId: string) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const deleted = await db
      .delete(paymentLinks)
      .where(and(eq(paymentLinks.id, linkId), eq(paymentLinks.userId, auth.user.id)))
      .returning({ id: paymentLinks.id });

    if (deleted.length === 0) {
      return { statusCode: 404, body: { error: "payment link not found" } };
    }

    return { statusCode: 200, body: { success: true } };
  }
}
