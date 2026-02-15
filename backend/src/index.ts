import express from "express";
import { apiRequest } from "./lib/apiClient.js";
import { fetchNewsEvents } from "./lib/predictLeadsClient.js";
import { newsEventsQuerySchema } from "./lib/predictLeadsTypes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Example: proxy route that fetches from an external API
app.get("/api/example", async (_req, res) => {
  try {
    // Example: fetch from JSONPlaceholder (public test API)
    const data = await apiRequest<{ id: number; title: string }[]>(
      "https://jsonplaceholder.typicode.com/posts?_limit=3"
    );
    res.json({ success: true, data });
  } catch (error) {
    console.error("API call failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PredictLeads news events (category: expands_office_to by default)
app.get("/api/news-events", async (req, res) => {
  try {
    const parsed = newsEventsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: parsed.error.flatten(),
      });
      return;
    }
    // do we validate the result data format? 
    const result = await fetchNewsEvents(parsed.data);
    res.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof Error && error.message.includes("PREDICTLEADS_API_KEY")) {
      res.status(503).json({
        success: false,
        error: "PredictLeads API is not configured. Set PREDICTLEADS_API_KEY.",
      });
      return;
    }
    console.error("PredictLeads API error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch news events",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
