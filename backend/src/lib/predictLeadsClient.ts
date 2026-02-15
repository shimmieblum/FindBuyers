/**
 * PredictLeads API client for the News Events dataset.
 * @see https://docs.predictleads.com/guide/news_events_dataset
 */

import { apiRequest } from "./apiClient.js";
import {
  newsEventsResponseSchema,
  type NewsEventsQuery,
  type NewsEventsResponse,
} from "./predictLeadsTypes.js";

// todo: remove default
const PREDICTLEADS_BASE_URL =
  process.env.PREDICTLEADS_BASE_URL ?? "https://api.predictleads.com";
const PREDICTLEADS_API_KEY = process.env.PREDICTLEADS_API_KEY;

function buildNewsEventsUrl(params: NewsEventsQuery): string {
  // todo: use package to build URL
  const searchParams = new URLSearchParams();

  searchParams.set("category", params.category);
  searchParams.set("page", String(params.page));
  searchParams.set("per_page", String(params.per_page));
  if (params.company_id) searchParams.set("company_id", params.company_id);
  if (params.from_date) searchParams.set("from_date", params.from_date);
  if (params.to_date) searchParams.set("to_date", params.to_date);

  const path = "/v3/news_events";
  return `${PREDICTLEADS_BASE_URL}${path}?${searchParams.toString()}`;
}

/**
 * Fetch news events from PredictLeads, filtered by category.
 * Requires PREDICTLEADS_API_KEY to be set.
 */
export async function fetchNewsEvents(
  params: Partial<NewsEventsQuery> = {}
): Promise<NewsEventsResponse> {
  const query: NewsEventsQuery = {
    // todo: remove default
    category: params.category ?? "expands_office_to",
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    company_id: params.company_id,
    from_date: params.from_date,
    to_date: params.to_date,
  };

  const url = buildNewsEventsUrl(query);

  if (!PREDICTLEADS_API_KEY) {
    throw new Error(
      "PREDICTLEADS_API_KEY is required. Set it in your environment."
    );
  }

  const raw = await apiRequest<unknown>(url, {
    headers: {
      Authorization: `Bearer ${PREDICTLEADS_API_KEY}`,
    },
    timeout: 15000,
  });

  return newsEventsResponseSchema.parse(raw);
}
