import { google } from "googleapis";
import stream from "stream";
import fs from "fs";
import path from "path";

let oauth2Client = null;

export function getOAuth2Client() {
  if (!oauth2Client) {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI =
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/oauth2callback";

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error(
        "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment variables"
      );
    }

    oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    // Load stored refresh token if available
    const tokenPath = path.join(process.cwd(), "token.json");
    if (fs.existsSync(tokenPath)) {
      const token = JSON.parse(fs.readFileSync(tokenPath));
      oauth2Client.setCredentials(token);
    }
  }
  return oauth2Client;
}

export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();
  const scopes = ["https://www.googleapis.com/auth/drive.file"];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Force consent to get refresh token
  });
}

export async function saveTokenFromCode(code) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Store the token for future use
  const tokenPath = path.join(process.cwd(), "token.json");
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log("Token stored to", tokenPath);

  return tokens;
}

export async function uploadToDrive(buffer, fileName, folderId) {
  const oauth2Client = getOAuth2Client();

  // Refresh token if needed
  if (
    oauth2Client.credentials.expiry_date &&
    oauth2Client.credentials.expiry_date <= Date.now()
  ) {
    await oauth2Client.refreshAccessToken();
    // Save updated token
    const tokenPath = path.join(process.cwd(), "token.json");
    fs.writeFileSync(tokenPath, JSON.stringify(oauth2Client.credentials));
  }

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // Create a readable stream from buffer
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  return await drive.files.create({
    requestBody: {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    },
    media: {
      mimeType: "application/pdf",
      body: bufferStream,
    },
  });
}
