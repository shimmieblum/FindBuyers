import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  AgencySchema,
  AddAgencyUserBodySchema,
  AgencyUserSchema,
  CreateAgencyBodySchema,
  RoleSchema,
  UpdateAgencyBodySchema,
  UpdateAgencyUserRoleBodySchema,
  UpsertUserDetailsBodySchema,
  UserDetailsSchema,
} from "../api/v1/schemas";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const ErrorSchema = z
  .object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  })
  .openapi("Error");

const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: ErrorSchema,
  })
  .openapi("ErrorResponse");

const UserDetailsResponseSchema = z
  .object({
    success: z.literal(true),
    data: UserDetailsSchema,
  })
  .openapi("UserDetailsResponse");

const AgencyResponseSchema = z
  .object({
    success: z.literal(true),
    data: AgencySchema,
  })
  .openapi("AgencyResponse");

const AgencyUsersResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.array(AgencyUserSchema),
  })
  .openapi("AgencyUsersResponse");

const AgencyUserResponseSchema = z
  .object({
    success: z.literal(true),
    data: AgencyUserSchema,
  })
  .openapi("AgencyUserResponse");

const AgencyUuidParam = z.string().uuid().openapi({
  param: {
    name: "agencyUuid",
    in: "path",
  },
});

const UserUuidParam = z.string().uuid().openapi({
  param: {
    name: "userUuid",
    in: "path",
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/user-details",
  summary: "Create or update the authenticated user's user-details record",
  tags: ["Onboarding"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpsertUserDetailsBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated",
      content: {
        "application/json": {
          schema: UserDetailsResponseSchema,
        },
      },
    },
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: UserDetailsResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/agencies",
  summary: "Create an agency; the authenticated user becomes the first admin",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateAgencyBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: AgencyResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/agencies/{agencyUuid}",
  summary: "Get an agency",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      agencyUuid: AgencyUuidParam,
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: AgencyResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/agencies/{agencyUuid}",
  summary: "Update an agency (admin only)",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      agencyUuid: AgencyUuidParam,
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateAgencyBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: AgencyResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/agencies/{agencyUuid}",
  summary: "Delete an agency (admin only)",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      agencyUuid: AgencyUuidParam,
    }),
  },
  responses: {
    204: {
      description: "Deleted",
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/agencies/{agencyUuid}/users",
  summary: "List agency users + roles",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      agencyUuid: AgencyUuidParam,
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: AgencyUsersResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/agencies/{agencyUuid}/users",
  summary: "Add an existing user to an agency (admin only)",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      agencyUuid: AgencyUuidParam,
    }),
    body: {
      content: {
        "application/json": {
          schema: AddAgencyUserBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: AgencyUserResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/agencies/{agencyUuid}/users/{userUuid}",
  summary: "Update a user's role within an agency (admin only)",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      agencyUuid: AgencyUuidParam,
      userUuid: UserUuidParam,
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateAgencyUserRoleBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: AgencyUserResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: "Conflict (e.g., would remove the last remaining admin)",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/agencies/{agencyUuid}/users/{userUuid}",
  summary: "Remove a user from an agency (admin only)",
  tags: ["Agencies"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      agencyUuid: AgencyUuidParam,
      userUuid: UserUuidParam,
    }),
  },
  responses: {
    204: {
      description: "Removed",
    },
    401: {
      description: "Unauthenticated",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: "Conflict (e.g., would remove the last remaining admin)",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

export function getOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "FindBuyers Backend API",
      version: "0.1.0",
      description:
        "API contract for agent onboarding (user-details) and agency management. Auth is handled by Supabase; clients must send Authorization: Bearer <supabase_jwt>.",
    },
    tags: [{ name: "Onboarding" }, { name: "Agencies" }],
    servers: [{ url: "http://localhost:3000" }],
  });
}
