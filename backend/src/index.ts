import express from "express";
import { createV1Router } from "./api/v1/router";
import predictLeadsApiClient from "./lib/PredictLeadsApiClient";
import type { NewsEventCategory } from "./lib/predictLeadsTypes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1", createV1Router());

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
