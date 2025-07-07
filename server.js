const express = require("express");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const path = require("path");

const creds = JSON.parse(process.env.GOOGLE_CREDS_JSON);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SPREADSHEET_ID = "1pzmEVa_jbJ_KQ0Ff6lhxrkyd-JQurasHSEICns1H_Nw";
const SHEET_NAME = "Gen Alpha Survey";

async function appendRow(data) {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[SHEET_NAME];
  if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" not found`);

  // Example: Map your data object keys to sheet columns
  await sheet.addRow({
    "Age Range": data.ageRange,
    "Section 0 Time (s)": data.timer0,
    "Section 1 Time (s)": data.timer1,
    "Section 2 Time (s)": data.timer2,
    "Section 3 Time (s)": data.timer3,
    "Section 4 Time (s)": data.timer4,
    "Section 5 Time (s)": data.timer5,
    "Section 6 Time (s)": data.timer6,
    "Ethnicity": data.ethnicity,
    "Frog Climb Question": data.frogClimb,
    "Juice Cups Question": data.juiceCups,
    "Juice Confidence": data.confJuice,
    "Juice Real/Fake": data.realFake1,
    "Juice Feel": data.feel1,
    "Cookies Question": data.cookies,
    "Cookies Confidence": data.confCookie,
    "Cookies Real/Fake": data.realFake2,
    "Cookies Feel": data.feel2,
    "Shoes Cost Question": data.shoesCost,
    "Shoes Confidence": data.confShoes,
    "Shoes Real/Fake": data.realFake3,
    "Shoes Feel": data.feel3,
  });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    await appendRow(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
