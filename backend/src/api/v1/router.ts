import { type Response, Router } from "express";
import {
  AddAgencyUserBodySchema,
  AgencyUuidParamsSchema,
  CreateAgencyBodySchema,
  UpdateAgencyBodySchema,
  UpsertUserDetailsBodySchema,
  UserUuidParamsSchema,
} from "./schemas";

function parseAuthHeader(authHeader: string | undefined): { token: string } | null {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return { token };
}

function notImplemented(res: Response): void {
  res.status(501).json({
    success: false,
    error: {
      code: "NOT_IMPLEMENTED",
      message:
        "API contract only: persistence/authz not implemented yet. See backend/openapi.yaml for the full contract.",
    },
  });
}

export function createV1Router(): Router {
  const router = Router();

  // All v1 endpoints require an Authorization: Bearer <supabase_jwt> header.
  router.use((req, res, next) => {
    const auth = parseAuthHeader(req.header("authorization"));
    if (!auth) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Missing or invalid Authorization header",
        },
      });
    }

    // Contract only. Token verification and extraction will be added in the implementation task.
    (req as unknown as { authToken: string }).authToken = auth.token;

    return next();
  });

  // --- User details (post-signup onboarding) ---

  // Upsert the user-details record for the authenticated user.
  router.post("/user-details", (req, res) => {
    const parsed = UpsertUserDetailsBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: parsed.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  // --- Agencies ---

  // Creates an agency; the authenticated user becomes the first admin.
  router.post("/agencies", (req, res) => {
    const parsed = CreateAgencyBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: parsed.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  router.get("/agencies/:agencyUuid", (req, res) => {
    const parsedParams = AgencyUuidParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path params",
          details: parsedParams.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  router.patch("/agencies/:agencyUuid", (req, res) => {
    const parsedParams = AgencyUuidParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path params",
          details: parsedParams.error.flatten(),
        },
      });
    }

    const parsedBody = UpdateAgencyBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: parsedBody.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  router.delete("/agencies/:agencyUuid", (req, res) => {
    const parsedParams = AgencyUuidParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path params",
          details: parsedParams.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  // --- Membership / roles ---

  // Included in the contract because agency admin/member roles are core.
  router.get("/agencies/:agencyUuid/users", (req, res) => {
    const parsedParams = AgencyUuidParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path params",
          details: parsedParams.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  router.post("/agencies/:agencyUuid/users", (req, res) => {
    const parsedParams = AgencyUuidParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path params",
          details: parsedParams.error.flatten(),
        },
      });
    }

    const parsedBody = AddAgencyUserBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: parsedBody.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  router.patch("/agencies/:agencyUuid/users/:userUuid", (req, res) => {
    const parsedParams = UserUuidParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path params",
          details: parsedParams.error.flatten(),
        },
      });
    }

    // Body schema will be finalized during implementation (promote/demote roles, etc.).
    return notImplemented(res);
  });

  router.delete("/agencies/:agencyUuid/users/:userUuid", (req, res) => {
    const parsedParams = UserUuidParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path params",
          details: parsedParams.error.flatten(),
        },
      });
    }

    return notImplemented(res);
  });

  return router;
}
