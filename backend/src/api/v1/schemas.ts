import { z } from "zod";

export const UuidSchema = z.string().uuid();
export const IsoDateTimeSchema = z.string().datetime();

export const RoleSchema = z.enum(["admin", "member"]);
export type Role = z.infer<typeof RoleSchema>;

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: ApiErrorSchema,
});

export const UserDetailsSchema = z.object({
  id: z.number().int().nonnegative(),
  uuid: UuidSchema,
  authUserId: UuidSchema,
  fullName: z.string().min(1).max(200),
  phone: z.string().min(3).max(50).optional().nullable(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});
export type UserDetails = z.infer<typeof UserDetailsSchema>;

export const UpsertUserDetailsBodySchema = z.object({
  fullName: z.string().min(1).max(200),
  phone: z.string().min(3).max(50).optional().nullable(),
});

export const AgencySchema = z.object({
  id: z.number().int().nonnegative(),
  uuid: UuidSchema,
  name: z.string().min(1).max(200),
  website: z.string().url().optional().nullable(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});
export type Agency = z.infer<typeof AgencySchema>;

export const CreateAgencyBodySchema = z.object({
  name: z.string().min(1).max(200),
  website: z.string().url().optional().nullable(),
});

export const UpdateAgencyBodySchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    website: z.string().url().optional().nullable(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const AgencyUuidParamsSchema = z.object({
  agencyUuid: UuidSchema,
});

export const UserUuidParamsSchema = z.object({
  agencyUuid: UuidSchema,
  userUuid: UuidSchema,
});

export const AgencyUserSchema = z.object({
  id: z.number().int().nonnegative(),
  uuid: UuidSchema,
  agencyUuid: UuidSchema,
  userUuid: UuidSchema,
  role: RoleSchema,
  createdAt: IsoDateTimeSchema,
});
export type AgencyUser = z.infer<typeof AgencyUserSchema>;

export const AddAgencyUserBodySchema = z.object({
  userUuid: UuidSchema,
  role: RoleSchema,
});

export const UpdateAgencyUserRoleBodySchema = z.object({
  role: RoleSchema,
});
