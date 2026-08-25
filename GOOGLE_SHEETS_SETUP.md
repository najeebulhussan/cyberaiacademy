# 📊 Cyber Smart — Google Sheets Integration Guide

Follow these simple steps (takes ~2 minutes) to automatically log every student registration, quiz score, and certificate download into your own live Google Sheet!

---

## 🚀 Step 1: Create a Google Sheet
1. Open Google Sheets (https://sheets.new) in your browser.
2. Name your spreadsheet: **CyberAI - Cyber Smart Student Records**.

---

## 📜 Step 2: Add the Google Apps Script
1. In your Google Sheet, click on the top menu: **Extensions** -> **Apps Script**.
2. Delete any existing code in the editor.
3. Paste the complete script below:

```javascript
/**
 * CYBERAI ACADEMY / CYBER SMART — GOOGLE APPS SCRIPT WEBHOOK
 * Automatically logs student registrations, exam results, and certificates.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(rawData);

    // Auto-create styled header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (PKT)",
        "Event Type",
        "Full Name",
        "Phone Number",
        "Email Address",
        "Progress",
        "Final Exam Score",
        "Status",
        "Course",
        "Action Details"
      ]);
      sheet.getRange(1, 1, 1, 10)
        .setFontWeight("bold")
        .setBackground("#005073")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    var timestamp = data.timestamp || new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });
    var eventType = data.event || "REGISTRATION";
    var name = data.name || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var progress = data.progress || "";
    var score = data.score || "";
    var status = data.status || "";
    var course = data.course || "Cyber Smart: AI-Powered Digital World";
    var details = data.details || data.action || "";

    // Append student record
    sheet.appendRow([
      timestamp,
      eventType,
      name,
      phone,
      email,
      progress,
      score,
      status,
      course,
      details
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Recorded" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Cyber Smart Google Sheets Webhook is active and running!");
}
```

4. Click the **Save** icon (or press `Ctrl + S`).

---

## 🌐 Step 3: Deploy as Web App
1. At the top right of Apps Script, click **Deploy** -> **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure the settings:
   - **Description**: `CyberSmart Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: allows student browsers to submit registrations)*
4. Click **Deploy**.
5. Click **Authorize access** (choose your Google account, click *Advanced* -> *Go to Untitled project (unsafe)* -> *Allow*).
6. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/...`).

---

## 🔗 Step 4: Add URL to Website
Whenever you get your Web App URL, paste it into `public/cybersmart-course/js/app.js` (or provide it to us to set as the default webhook URL).
