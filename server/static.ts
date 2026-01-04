import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  console.log(`[static] Serving files from: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    console.error(`[static] ERROR: Directory not found: ${distPath}`);
    // fallback to client dir if dist/public is missing (useful for some environments)
    const fallbackPath = path.resolve(process.cwd(), "client");
    console.log(`[static] Attempting fallback to: ${fallbackPath}`);
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
