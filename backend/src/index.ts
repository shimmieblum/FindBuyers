import express from "express";
import { apiRequest } from "./lib/apiClient.js";

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
