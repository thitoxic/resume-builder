# Google Drive Setup Guide (OAuth2 - Personal Account)

Follow these steps to set up Google Drive integration using your personal Google account:

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "resume-builder")
5. Click "Create"

## Step 2: Enable Google Drive API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google Drive API"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: "Resume Builder" (or any name you prefer)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. On the "Scopes" page:
   - Click "Add or Remove Scopes"
   - Search for and select: `https://www.googleapis.com/auth/drive.file`
   - Click "Update" then "Save and Continue"
7. On the "Test users" page (IMPORTANT):
   - Click "+ ADD USERS"
   - **Add your Gmail address** (the one you'll use to authorize)
   - Click "Add"
   - Click "Save and Continue"
8. Review and go back to Dashboard (you can skip the summary)

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Name it (e.g., "Resume Builder")
5. Add authorized redirect URIs:
   - `http://localhost:5000/oauth2callback`
   - (Add your production URL if deploying)
6. Click "Create"
7. **Copy the Client ID and Client Secret** - you'll need these!

## Step 5: Create Environment File

1. In the `server/` folder, create a file named `.env`
2. Add the following:

```
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth2callback
RESUME_FOLDER_ID=your-folder-id-here
PORT=5000
```

Replace:

- `your-client-id-here` with your OAuth Client ID from Step 3
- `your-client-secret-here` with your OAuth Client Secret from Step 3
- `your-folder-id-here` with your Google Drive folder ID (see Step 5)

## Step 6: Get Your Google Drive Folder ID

1. Create a folder in your Google Drive (or use an existing one)
2. Open the folder
3. Get the **Folder ID** from the URL:
   - The URL looks like: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the `FOLDER_ID_HERE` part
4. Add this to your `.env` file as `RESUME_FOLDER_ID`

## Step 7: Authorize the Application

1. Start the server: `npm start` (from the server folder)
2. Visit: `http://localhost:5000/auth` in your browser
   - Or call the endpoint to get the authorization URL
3. You'll be redirected to Google to sign in and authorize
4. After authorization, you'll be redirected back and see a success message
5. A `token.json` file will be created in the `server/` folder (this stores your refresh token)

## Step 8: Verify Setup

1. Make sure `.env` file exists with all required values
2. Make sure you've completed the authorization (Step 6)
3. Try exporting a resume from the client

## Troubleshooting

- **"App is currently being tested"**: Make sure you added your Gmail address as a test user in Step 3 (OAuth consent screen > Test users)
- **"Not authenticated"**: Make sure you've completed Step 7 (authorization)
- **"API not enabled"**: Make sure Google Drive API is enabled in your Google Cloud project
- **"Invalid client"**: Check that your Client ID and Secret in `.env` are correct
- **"Redirect URI mismatch"**: Make sure the redirect URI in Google Cloud Console matches `http://localhost:5000/oauth2callback`
- **Token expired**: Delete `token.json` and re-authorize (Step 7)

## Notes

- The `token.json` file contains your refresh token - keep it secure and don't commit it to git
- The token allows the app to access your Google Drive - you can revoke access in [Google Account Settings](https://myaccount.google.com/permissions)
- If you change the OAuth scopes, you'll need to delete `token.json` and re-authorize
