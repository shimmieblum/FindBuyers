import express from "express";
import predictLeadsApiClient from "./lib/PredictLeadsApiClient";
import type { NewsEventCategory } from "./lib/predictLeadsTypes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/news-reports", async (_req, res) => {
  try {
    const categories: NewsEventCategory[] = [
      "opens_new_location",
      "expands_offices_to",
    ];
    const company_location = "United Kingdom";

    const data = await predictLeadsApiClient.getNewsEvents({
      categories,
      company_location,
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch news reports:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch news reports",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
