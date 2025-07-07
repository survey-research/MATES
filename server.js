const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const SPREADSHEET_ID = "1pzmEVa_jbJ_KQ0Ff6lhxrkyd-JQurasHSEICns1H_Nw";
const SHEET_NAME = "Gen Alpha Survey";

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

    const row = [
      d.age || "",
      d.ethnicity || "",
      d.section0Time || 0,
      d.section2Time || 0,
      d.section4Time || 0,
      d.section6Time || 0,
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
      d.feelingQ3 || ""
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
    console.error("Error submitting to Google Sheets:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

