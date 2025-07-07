import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Set your spreadsheet ID and sheet name here:
const SPREADSHEET_ID = "1pzmEVa_jbJ_KQ0Ff6lhxrkyd-JQurasHSEICns1H_Nw";
const SHEET_NAME = "Gen Alpha Survey";

// Authenticate with Google Sheets API using service account
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

app.post("/submit", async (req, res) => {
  try {
    const d = req.body;

    // Map the incoming data to your exact column order:
    const row = [
      d.age || "",
      d.ethnicity || "",
      d.section0Time || 0,
      d.section1Time || 0,  // If you want to track this (likely 0, no inputs in video sections)
      d.section2Time || 0,
      d.section3Time || 0,
      d.logicQ1 || "",
      d.q1 || "",
      d.confidenceQ1 || "",
      d.realFakeQ1 || "",
      d.feelingQ1 || "",
      d.q2 || "",
      d.confidenceQ2 || "",
      d.realFake2 || "",
      d.feelingQ2 || "",
      d.q3 || "",
      d.confidenceQ3 || "",
      d.realFake3 || "",
      d.feelingQ3 || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error appending to sheet:", error);
    res.json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
