import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { uploadToDrive } from "./google-drive.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const RESUME_FOLDER_ID = process.env.RESUME_FOLDER_ID;
const SERVICE_ACCOUNT_PATH =
  process.env.SERVICE_ACCOUNT_PATH ||
  path.join(process.cwd(), "service-account.json");
const PORT = process.env.PORT || 5000;

if (!RESUME_FOLDER_ID) {
  console.warn(
    "Warning: RESUME_FOLDER_ID not set. Set it in server/.env or environment variables."
  );
}

app.post("/export", async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: "Missing html in body" });

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set content and wait for images/styles
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    const fileName = `resume_${new Date().toISOString()}.pdf`;

    await uploadToDrive(
      Buffer.from(pdfBuffer),
      fileName,
      RESUME_FOLDER_ID,
      SERVICE_ACCOUNT_PATH
    );

    res.json({ success: true, fileName });
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: err.message || "Export failed" });
  }
});

app.listen(PORT, () => console.log(`Resume server listening on ${PORT}`));
