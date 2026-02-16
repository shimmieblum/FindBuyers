import axios, { AxiosInstance } from "axios";
import {
  DiscoverNewsEventsQuery,
  DiscoverNewsEventsResponse,
  discoverNewsEventsResponseSchema,
} from "./predictLeadsTypes";

interface PredictLeadsApiClient {
  getNewsEvents: (
    params: DiscoverNewsEventsQuery,
  ) => Promise<DiscoverNewsEventsResponse>;
}

if (!process.env.PREDICTLEADS_API_KEY || !process.env.PREDICTLEADS_API_TOKEN) {
  throw new Error(
    "PREDICTLEADS_API_KEY and PREDICTLEADS_API_TOKEN are required",
  );
}

if(!process.env.PREDICTLEADS_BASE_URL) {
  throw new Error(
    "PREDICTLEADS_BASE_URL is required",
  );
}

const client: AxiosInstance = axios.create({
  baseURL:
    process.env.PREDICTLEADS_BASE_URL,
  headers: {
    "X-Api-Key": process.env.PREDICTLEADS_API_KEY,
    "X-Api-Token": process.env.PREDICTLEADS_API_TOKEN,
  },
});

const predictLeadsApiClient: PredictLeadsApiClient = {
  getNewsEvents: async (params: DiscoverNewsEventsQuery) => {
    const response = await client.get("/discover/news_events", {
      params: {
        categories: params.categories?.join(",") || undefined,
        page: params.page,
        limit: params.limit,
        company_location: params.company_location,
      },
    });
    return discoverNewsEventsResponseSchema.parse(response.data);
  },
};

export default predictLeadsApiClient;
