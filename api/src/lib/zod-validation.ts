import type { ZodError } from "zod";

export const ZOD_VALIDATION_ERROR = "validation_error";

export function getZodErrorMessage(error: ZodError): string {
  const firstIssue = error.issues[0];
  if (!firstIssue) {
    return "Invalid request payload.";
  }

  if (firstIssue.path.length === 0) {
    return firstIssue.message;
  }

  return `${firstIssue.path.join(".")}: ${firstIssue.message}`;
}
