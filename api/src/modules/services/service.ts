import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "../../db/client";
import { services, endpoints } from "../../db/schema";
import { newId } from "../../lib/crypto";
import { parseOpenApiSpec } from "../../lib/openapi-parser";
import { AuthContextService } from "../../services/auth-context.service";
import { TimeService } from "../../services/time.service";
import type { ServicesModel } from "./model";

function maskApiKey(key: string | null): string | null {
  if (!key) return null;
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}

export abstract class ServicesService {
  static async list(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const rows = await db
      .select({
        id: services.id,
        name: services.name,
        description: services.description,
        faviconUrl: services.faviconUrl,
        baseUrl: services.baseUrl,
        websocketUrl: services.websocketUrl,
        authMethod: services.authMethod,
        isLive: services.isLive,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
        endpointCount: sql<number>`(select count(*) from endpoints where endpoints.service_id = services.id)`.as("endpoint_count"),
      })
      .from(services)
      .where(eq(services.userId, auth.user.id))
      .orderBy(desc(services.createdAt));

    return { statusCode: 200, body: { services: rows } };
  }

  static async create(request: Request, payload: ServicesModel.CreateServiceBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const id = newId("svc");
    const now = TimeService.nowIso();

    await db.insert(services).values({
      id,
      userId: auth.user.id,
      name: payload.name,
      description: payload.description ?? null,
      faviconUrl: payload.faviconUrl ?? null,
      baseUrl: payload.baseUrl,
      websocketUrl: payload.websocketUrl ?? null,
      authMethod: payload.authMethod,
      apiKey: payload.apiKey ?? null,
      isLive: payload.isLive ? "true" : "false",
      createdAt: now,
      updatedAt: now,
    });

    return {
      statusCode: 200,
      body: {
        service: {
          id,
          name: payload.name,
          description: payload.description ?? null,
          faviconUrl: payload.faviconUrl ?? null,
          baseUrl: payload.baseUrl,
          websocketUrl: payload.websocketUrl ?? null,
          authMethod: payload.authMethod,
          apiKey: maskApiKey(payload.apiKey ?? null),
          isLive: payload.isLive ? "true" : "false",
          createdAt: now,
          updatedAt: now,
        },
      },
    };
  }

  static async get(request: Request, serviceId: string) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [service] = await db
      .select()
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .limit(1);

    if (!service) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    const eps = await db
      .select()
      .from(endpoints)
      .where(eq(endpoints.serviceId, serviceId))
      .orderBy(desc(endpoints.createdAt));

    return {
      statusCode: 200,
      body: {
        service: { ...service, apiKey: maskApiKey(service.apiKey) },
        endpoints: eps,
      },
    };
  }

  static async update(request: Request, serviceId: string, payload: ServicesModel.UpdateServiceBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const updates: Record<string, unknown> = { updatedAt: TimeService.nowIso() };
    if (payload.name !== undefined) updates.name = payload.name;
    if (payload.baseUrl !== undefined) updates.baseUrl = payload.baseUrl;
    if (payload.description !== undefined) updates.description = payload.description;
    if (payload.faviconUrl !== undefined) updates.faviconUrl = payload.faviconUrl;
    if (payload.websocketUrl !== undefined) updates.websocketUrl = payload.websocketUrl;
    if (payload.authMethod !== undefined) updates.authMethod = payload.authMethod;
    if (payload.apiKey !== undefined) updates.apiKey = payload.apiKey;
    if (payload.isLive !== undefined) updates.isLive = payload.isLive ? "true" : "false";

    const updated = await db
      .update(services)
      .set(updates)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .returning({ id: services.id });

    if (updated.length === 0) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    return { statusCode: 200, body: { success: true } };
  }

  static async delete(request: Request, serviceId: string) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const deleted = await db
      .delete(services)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .returning({ id: services.id });

    if (deleted.length === 0) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    return { statusCode: 200, body: { success: true } };
  }

  static async listEndpoints(request: Request, serviceId: string) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [service] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .limit(1);

    if (!service) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    const eps = await db
      .select()
      .from(endpoints)
      .where(eq(endpoints.serviceId, serviceId))
      .orderBy(desc(endpoints.createdAt));

    return { statusCode: 200, body: { endpoints: eps } };
  }

  static async createEndpoint(request: Request, serviceId: string, payload: ServicesModel.CreateEndpointBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [service] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .limit(1);

    if (!service) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    const id = newId("ep");
    const now = TimeService.nowIso();

    await db.insert(endpoints).values({
      id,
      serviceId,
      method: payload.method,
      path: payload.path,
      priceCents: payload.priceCents,
      isEnabled: payload.isEnabled === false ? "false" : "true",
      createdAt: now,
      updatedAt: now,
    });

    return {
      statusCode: 200,
      body: {
        endpoint: {
          id,
          serviceId,
          method: payload.method,
          path: payload.path,
          priceCents: payload.priceCents,
          isEnabled: payload.isEnabled === false ? "false" : "true",
          createdAt: now,
          updatedAt: now,
        },
      },
    };
  }

  static async updateEndpoint(request: Request, serviceId: string, endpointId: string, payload: ServicesModel.UpdateEndpointBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [service] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .limit(1);

    if (!service) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    const updates: Record<string, unknown> = { updatedAt: TimeService.nowIso() };
    if (payload.method !== undefined) updates.method = payload.method;
    if (payload.path !== undefined) updates.path = payload.path;
    if (payload.priceCents !== undefined) updates.priceCents = payload.priceCents;
    if (payload.isEnabled !== undefined) updates.isEnabled = payload.isEnabled ? "true" : "false";

    const updated = await db
      .update(endpoints)
      .set(updates)
      .where(and(eq(endpoints.id, endpointId), eq(endpoints.serviceId, serviceId)))
      .returning({ id: endpoints.id });

    if (updated.length === 0) {
      return { statusCode: 404, body: { error: "endpoint not found" } };
    }

    return { statusCode: 200, body: { success: true } };
  }

  static async deleteEndpoint(request: Request, serviceId: string, endpointId: string) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [service] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .limit(1);

    if (!service) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    const deleted = await db
      .delete(endpoints)
      .where(and(eq(endpoints.id, endpointId), eq(endpoints.serviceId, serviceId)))
      .returning({ id: endpoints.id });

    if (deleted.length === 0) {
      return { statusCode: 404, body: { error: "endpoint not found" } };
    }

    return { statusCode: 200, body: { success: true } };
  }

  static async importEndpoints(request: Request, serviceId: string, payload: ServicesModel.ImportEndpointsBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [service] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.userId, auth.user.id)))
      .limit(1);

    if (!service) {
      return { statusCode: 404, body: { error: "service not found" } };
    }

    let specString: string;
    if ("spec" in payload) {
      specString = payload.spec;
    } else {
      const res = await fetch(payload.url);
      if (!res.ok) {
        return { statusCode: 400, body: { error: "failed to fetch OpenAPI spec from URL" } };
      }
      specString = await res.text();
    }

    let parsed: { method: string; path: string; priceCents: number }[];
    try {
      parsed = parseOpenApiSpec(specString);
    } catch {
      return { statusCode: 400, body: { error: "invalid OpenAPI spec" } };
    }

    if (parsed.length === 0) {
      return { statusCode: 200, body: { imported: 0 } };
    }

    const now = TimeService.nowIso();
    const rows = parsed.map((ep) => ({
      id: newId("ep"),
      serviceId,
      method: ep.method,
      path: ep.path,
      priceCents: ep.priceCents,
      isEnabled: "true" as const,
      createdAt: now,
      updatedAt: now,
    }));

    await db.insert(endpoints).values(rows);

    return { statusCode: 200, body: { imported: rows.length, endpoints: rows } };
  }
}
