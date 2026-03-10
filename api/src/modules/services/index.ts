import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
import { ServicesModel } from "./model";
import { ServicesService } from "./service";

export const servicesModule = new Elysia({ name: "module.services", prefix: "/v1/services" })
  .get("", async ({ request, set }) => {
    const result = await ServicesService.list(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post(
    "",
    async ({ request, body, set }) => {
      const parsedBody = ServicesModel.createServiceBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await ServicesService.create(request, parsedBody.data);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .get(
    "/:serviceId",
    async ({ request, params, set }) => {
      const parsedParams = ServicesModel.serviceIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const result = await ServicesService.get(request, parsedParams.data.serviceId);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .patch(
    "/:serviceId",
    async ({ request, params, body, set }) => {
      const parsedParams = ServicesModel.serviceIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const parsedBody = ServicesModel.updateServiceBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await ServicesService.update(
        request,
        parsedParams.data.serviceId,
        parsedBody.data
      );
      set.status = result.statusCode;
      return result.body;
    }
  )
  .delete(
    "/:serviceId",
    async ({ request, params, set }) => {
      const parsedParams = ServicesModel.serviceIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const result = await ServicesService.delete(request, parsedParams.data.serviceId);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .get(
    "/:serviceId/endpoints",
    async ({ request, params, set }) => {
      const parsedParams = ServicesModel.serviceIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const result = await ServicesService.listEndpoints(request, parsedParams.data.serviceId);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .post(
    "/:serviceId/endpoints",
    async ({ request, params, body, set }) => {
      const parsedParams = ServicesModel.serviceIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const parsedBody = ServicesModel.createEndpointBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await ServicesService.createEndpoint(
        request,
        parsedParams.data.serviceId,
        parsedBody.data
      );
      set.status = result.statusCode;
      return result.body;
    }
  )
  .post(
    "/:serviceId/endpoints/import",
    async ({ request, params, body, set }) => {
      const parsedParams = ServicesModel.serviceIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const parsedBody = ServicesModel.importEndpointsBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await ServicesService.importEndpoints(
        request,
        parsedParams.data.serviceId,
        parsedBody.data
      );
      set.status = result.statusCode;
      return result.body;
    }
  )
  .patch(
    "/:serviceId/endpoints/:endpointId",
    async ({ request, params, body, set }) => {
      const parsedParams = ServicesModel.endpointIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const parsedBody = ServicesModel.updateEndpointBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await ServicesService.updateEndpoint(
        request,
        parsedParams.data.serviceId,
        parsedParams.data.endpointId,
        parsedBody.data
      );
      set.status = result.statusCode;
      return result.body;
    }
  )
  .delete(
    "/:serviceId/endpoints/:endpointId",
    async ({ request, params, set }) => {
      const parsedParams = ServicesModel.endpointIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const result = await ServicesService.deleteEndpoint(
        request,
        parsedParams.data.serviceId,
        parsedParams.data.endpointId
      );
      set.status = result.statusCode;
      return result.body;
    }
  );
