import type { PaymentLinkRecord } from "@/lib/api";
import { serverApiRequest } from "@/lib/server-api";

import { PaymentLinksClient } from "./payment-links-client";

export default async function PaymentLinksPage() {
  const response = await serverApiRequest<{ paymentLinks: PaymentLinkRecord[] }>("/v1/payment-links");
  const initialLinks = response.status < 400 ? response.data.paymentLinks : [];

  return <PaymentLinksClient initialLinks={initialLinks} />;
}
