/**
 * PredictLeads API types and Zod schemas for the News Events dataset.
 * @see https://docs.predictleads.com/guide/news_events_dataset
 */

import { iso31661 } from "iso-3166";
import { z } from "zod";

/** Valid news event categories (from PredictLeads API docs). */
export const NEWS_EVENT_CATEGORIES = [
  "acquires",
  "merges_with",
  "sells_assets_to",
  "signs_new_client",
  "files_suit_against",
  "has_issues_with",
  "closes_offices_in",
  "decreases_headcount_by",
  "attends_event",
  "expands_facilities",
  "expands_offices_in",
  "expands_offices_to",
  "increases_headcount_by",
  "opens_new_location",
  "goes_public",
  "invests_into",
  "invests_into_assets",
  "receives_financing",
  "hires",
  "leaves",
  "promotes",
  "retires_from",
  "integrates_with",
  "is_developing",
  "launches",
  "partners_with",
  "receives_award",
  "recognized_as",
  "identified_as_competitor_of",
] as const;

export type NewsEventCategory = (typeof NEWS_EVENT_CATEGORIES)[number];

/** ISO 3166-1 alpha-2 country codes (from iso-3166; e.g. for company_location filter). */
export const ISO_COUNTRY_CODES = [
  ...iso31661.map((e) => e.alpha2),
] as const;

/** Use for company_location and other country filters. */
export type IsoCountryCode = (typeof ISO_COUNTRY_CODES)[number];

// ----- NewsEventsDataset (from JSON Schema) -----

/** financing_type_normalized enum from API (plus null). */
const FINANCING_TYPE_NORMALIZED_VALUES = [
  "pre_angel", "angel_plus", "angel_plus_plus", "angel", "angel_1", "angel_2", "angel_3",
  "pre_seed", "seed_plus", "seed_plus_plus", "seed", "seed_1", "seed_2", "seed_3",
  "pre_series_a", "series_a_plus", "series_a_plus_plus", "series_a", "series_a1", "series_a2", "series_a3",
  "pre_series_b", "series_b_plus", "series_b_plus_plus", "series_b", "series_b1", "series_b2", "series_b3",
  "pre_series_c", "series_c_plus", "series_c_plus_plus", "series_c", "series_c1", "series_c2", "series_c3",
  "pre_series_d", "series_d_plus", "series_d_plus_plus", "series_d", "series_d1", "series_d2", "series_d3",
  "pre_series_e", "series_e_plus", "series_e_plus_plus", "series_e", "series_e1", "series_e2", "series_e3",
  "pre_series_f", "series_f_plus", "series_f_plus_plus", "series_f", "series_f1", "series_f2", "series_f3",
  "pre_series_g", "series_g_plus", "series_g_plus_plus", "series_g", "series_g1", "series_g2", "series_g3",
  "pre_series_h", "series_h_plus", "series_h_plus_plus", "series_h", "series_h1", "series_h2", "series_h3",
  "pre_series_i", "series_i_plus", "series_i_plus_plus", "series_i", "series_i1", "series_i2", "series_i3",
  "pre_series_j", "series_j_plus", "series_j_plus_plus", "series_j", "series_j1", "series_j2", "series_j3",
  "pre_angel_bridge", "angel_plus_bridge", "angel_plus_plus_bridge", "angel_bridge", "angel_1_bridge", "angel_2_bridge", "angel_3_bridge",
  "pre_seed_bridge", "seed_plus_bridge", "seed_plus_plus_bridge", "seed_bridge", "seed_1_bridge", "seed_2_bridge", "seed_3_bridge",
  "pre_series_a_bridge", "series_a_plus_bridge", "series_a_plus_plus_bridge", "series_a_bridge", "series_a1_bridge", "series_a2_bridge", "series_a3_bridge",
  "pre_series_b_bridge", "series_b_plus_bridge", "series_b_plus_plus_bridge", "series_b_bridge", "series_b1_bridge", "series_b2_bridge", "series_b3_bridge",
  "pre_series_c_bridge", "series_c_plus_bridge", "series_c_plus_plus_bridge", "series_c_bridge", "series_c1_bridge", "series_c2_bridge", "series_c3_bridge",
  "pre_series_d_bridge", "series_d_plus_bridge", "series_d_plus_plus_bridge", "series_d_bridge", "series_d1_bridge", "series_d2_bridge", "series_d3_bridge",
  "pre_series_e_bridge", "series_e_plus_bridge", "series_e_plus_plus_bridge", "series_e_bridge", "series_e1_bridge", "series_e2_bridge", "series_e3_bridge",
] as const;

const locationDataItemSchema = z.object({
  city: z.string().nullable(),
  state: z.string().nullable(),
  zip_code: z.string().nullable(),
  country: z.string().nullable(),
  region: z.string().nullable(),
  continent: z.string().nullable(),
  fuzzy_match: z.boolean().nullable(),
});

const productDataSchema = z.object({
  full_text: z.string().nullable(),
  name: z.string().nullable(),
  release_type: z.string().nullable(),
  release_version: z.string().nullable(),
  fuzzy_match: z.boolean().nullable(),
});

const newsEventAttributesSchema = z.object({
  summary: z.string(),
  category: z.enum(NEWS_EVENT_CATEGORIES),
  found_at: z.string(),
  confidence: z.number().min(0).max(1),
  article_sentence: z.string(),
  planning: z.boolean(),
  amount: z.string().nullable(),
  amount_normalized: z.number().int().nullable(),
  assets: z.string().nullable(),
  assets_tags: z.array(z.string()),
  award: z.string().nullable(),
  contact: z.string().nullable(),
  event: z.string().nullable(),
  effective_date: z.string().nullable(),
  division: z.string().nullable(),
  financing_type: z.string().nullable(),
  financing_type_normalized: z.union([z.enum(FINANCING_TYPE_NORMALIZED_VALUES), z.null()]),
  financing_type_tags: z.array(z.string()),
  headcount: z.number().int().nullable(),
  job_title: z.string().nullable(),
  job_title_tags: z.array(z.string()),
  location: z.string().nullable(),
  location_data: z.array(locationDataItemSchema),
  product: z.string().nullable(),
  product_data: productDataSchema,
  product_tags: z.array(z.string()),
  recognition: z.string().nullable(),
  vulnerability: z.string().nullable(),
});

const companyRelationshipSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.literal("company"),
  }),
});

const newsArticleRelationshipSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.literal("news_article"),
  }),
});

const newsEventRelationshipsSchema = z.object({
  company1: companyRelationshipSchema.optional(),
  company2: companyRelationshipSchema.optional(),
  most_relevant_source: newsArticleRelationshipSchema,
});

/** NewsEvent (data[] item). */
export const newsEventSchema = z.object({
  id: z.string(),
  type: z.literal("news_event"),
  attributes: newsEventAttributesSchema,
  relationships: newsEventRelationshipsSchema,
});

export type NewsEvent = z.infer<typeof newsEventSchema>;

/** CompanyLite (included item). */
const companyLiteSchema = z.object({
  id: z.string(),
  type: z.literal("company"),
  attributes: z.object({
    domain: z.string(),
    company_name: z.string().nullable(),
    ticker: z.string().nullable(),
  }),
});

/** NewsArticleLite (included item). */
const newsArticleLiteSchema = z.object({
  id: z.string(),
  type: z.literal("news_article"),
  attributes: z.object({
    url: z.string(),
    title: z.string(),
    author: z.string().nullable(),
    image_url: z.string().nullable(),
    published_at: z.string(),
    body: z.string(),
  }),
});

/** Included item (CompanyLite | NewsArticleLite). */
export const includedResourceSchema = z.discriminatedUnion("type", [
  companyLiteSchema,
  newsArticleLiteSchema,
]);

export type IncludedResource = z.infer<typeof includedResourceSchema>;

/** Meta (optional top-level). */
export const newsEventsMetaSchema = z.object({
  schema_version: z.string(),
  record_state: z.literal("active"),
  count: z.number().int().optional(),
});

export type NewsEventsMeta = z.infer<typeof newsEventsMetaSchema>;

/** NewsEventsDataset response (data + included required; meta optional). */
export const newsEventsResponseSchema = z.object({
  data: z.array(newsEventSchema),
  included: z.array(includedResourceSchema),
  meta: newsEventsMetaSchema.optional(),
});

export type NewsEventsResponse = z.infer<typeof newsEventsResponseSchema>;

/** Query params for fetching news events. */
export const newsEventsQuerySchema = z.object({
  category: z.enum(NEWS_EVENT_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  company_location: z.enum(ISO_COUNTRY_CODES).optional(),
});

export type DiscoverNewsEventsQuery = z.infer<typeof newsEventsQuerySchema>;
