import { google } from "googleapis";
import fs from "fs";

export async function uploadToDrive(
  buffer,
  fileName,
  folderId,
  serviceAccountPath
) {
  // Accept either a path to service account JSON or rely on environment
  const keyFile = serviceAccountPath || process.env.SERVICE_ACCOUNT_PATH;

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });

  // media.body expects a stream or buffer
  return await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: "application/pdf",
      body: buffer,
    },
  });
}
