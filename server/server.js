import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {
  uploadToDrive,
  getAuthUrl,
  saveTokenFromCode,
} from "./google-drive.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const RESUME_FOLDER_ID = process.env.RESUME_FOLDER_ID;
const PORT = process.env.PORT || 5000;

// OAuth2 authentication endpoint
app.get("/auth", (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OAuth2 callback endpoint
app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    await saveTokenFromCode(code);
    res.send(`
      <html>
        <body>
          <h1>Authorization Successful!</h1>
          <p>You can now close this window and use the export feature.</p>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Error saving token:", err);
    res.status(500).send(`Error: ${err.message}`);
  }
});

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

    await uploadToDrive(Buffer.from(pdfBuffer), fileName, RESUME_FOLDER_ID);

    res.json({ success: true, fileName });
  } catch (err) {
    console.error("Export error:", err);

    // Check if it's an authentication error
    if (
      (err.message && err.message.includes("invalid_grant")) ||
      (err.message && err.message.includes("No refresh token"))
    ) {
      res.status(401).json({
        error: "Not authenticated. Please authorize the app first.",
        needsAuth: true,
      });
    } else {
      res.status(500).json({ error: err.message || "Export failed" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Resume server listening on ${PORT}`);
  console.log(`\nTo authorize Google Drive access:`);
  console.log(`1. Visit: http://localhost:${PORT}/auth`);
  console.log(`2. Or call the /auth endpoint to get the authorization URL`);
});
