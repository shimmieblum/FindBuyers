/**
 * PredictLeads API types and Zod schemas for the News Events dataset.
 * @see https://docs.predictleads.com/guide/news_events_dataset
 */

import { z } from "zod";

/** Valid news event categories. */
export const NEWS_EVENT_CATEGORIES = [
  "expands_office_to",
  "expands_product_to",
  "acquires",
  "partners_with",
  "hires",
  "raises",
  "launches",
  "relocates",
  "other",
] as const;

export type NewsEventCategory = (typeof NEWS_EVENT_CATEGORIES)[number];

/** Schema for a single news event (flexible to accommodate API response shape). */
export const newsEventSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    type: z.string().optional(),
    attributes: z
      .object({
        category: z.string().optional(),
        title: z.string().optional(),
        summary: z.string().optional(),
        url: z.string().url().optional().or(z.string()),
        published_at: z.string().optional(),
        detected_at: z.string().optional(),
        source_name: z.string().optional(),
        source_url: z.string().optional(),
        company_id: z.union([z.string(), z.number()]).optional(),
        company_name: z.string().optional(),
      })
      .passthrough()
      .optional(),
    // JSON:API style may have attributes at top level
    category: z.string().optional(),
    title: z.string().optional(),
    summary: z.string().optional(),
    url: z.string().optional(),
    published_at: z.string().optional(),
    detected_at: z.string().optional(),
    source_name: z.string().optional(),
    company_id: z.union([z.string(), z.number()]).optional(),
    company_name: z.string().optional(),
  })
  .passthrough();

export type NewsEvent = z.infer<typeof newsEventSchema>;

/** Pagination meta (common patterns). */
export const paginationMetaSchema = z
  .object({
    page: z.number().optional(),
    per_page: z.number().optional(),
    total: z.number().optional(),
    total_pages: z.number().optional(),
    next_page: z.union([z.string(), z.number(), z.null()]).optional(),
    prev_page: z.union([z.string(), z.number(), z.null()]).optional(),
  })
  .passthrough();

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/** Response schema for the news events list endpoint. */
export const newsEventsResponseSchema = z
  .object({
    data: z.array(newsEventSchema),
    meta: paginationMetaSchema.optional(),
    included: z.array(z.unknown()).optional(),
  })
  .passthrough();

export type NewsEventsResponse = z.infer<typeof newsEventsResponseSchema>;

/** Query params for fetching news events. */
export const newsEventsQuerySchema = z.object({
  category: z.enum(NEWS_EVENT_CATEGORIES).optional().default("expands_office_to"),
  page: z.coerce.number().int().min(1).optional().default(1),
  per_page: z.coerce.number().int().min(1).max(100).optional().default(20),
  company_id: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export type NewsEventsQuery = z.infer<typeof newsEventsQuerySchema>;
