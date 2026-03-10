import type { ServiceRecord } from "@/lib/api";
import { serverApiRequest } from "@/lib/server-api";

import { ServicesClient } from "./services-client";

export default async function ServicesPage() {
  const response = await serverApiRequest<{ services: ServiceRecord[] }>("/v1/services");
  const initialServices = response.status < 400 ? response.data.services : [];

  return <ServicesClient initialServices={initialServices} />;
}
