// server.js — the secure backend for Angel Thank-You Studio.
// It holds the secret API key, calls Claude to write each note,
// and serves the web page. The key never reaches the browser.

const express = require("express");
const path = require("path");
require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(express.json());

// Serve the web page (index.html) and any static files from this folder.
app.use(express.static(path.join(__dirname)));

// Create the Claude client using the secret key from the .env file.
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The real Myra's Angels Foundation voice, given to the AI as context.
const BRAND = `
Organization: Myra's Angels Foundation (a 501(c)(3) nonprofit, founded 2017, in Wake Forest, NC).
Mission: improving the lives of foster children and children experiencing homelessness in Wake County
and surrounding areas of North Carolina by providing "Angel Care Bags" filled with new essential and
comfort items (full-sized toiletries, pajamas, clothing, school supplies, blankets, comfort items),
giving each child something to call their own.
Tagline: "One bag full of love creates a child full of hope."
Voice: warm, sincere, human, and specific. Never flowery or corporate. Avoid em dashes.
`;

// This is the endpoint the web page calls to generate a note.
app.post("/api/generate", async (req, res) => {
  try {
    const d = req.body || {};

    // Build a clear instruction for Claude from the form details.
    const facts = [
      d.donor ? `Donor name: ${d.donor}` : "Donor name: (unknown, address them warmly)",
      `Channel: ${d.channel === "text" ? "a short, friendly text message (SMS)" : "an email"}`,
      `Gift type: ${d.gift || "items"}`,
      d.items ? `Items donated: ${d.items}` : "",
      d.amount ? `Amount donated: ${d.amount}` : "",
      d.occasion ? `Occasion: ${d.occasion}` : "",
      `Tone: ${d.tone || "warm"}`,
      d.signer ? `Signed by: ${d.signer}` : "Signed by: Myra & the Myra's Angels Foundation Team",
      d.personal ? `Please naturally include this personal note from the sender: "${d.personal}"` : ""
    ].filter(Boolean).join("\n");

    const lengthRule = d.channel === "text"
      ? "Keep it under 90 words, friendly and concise, suitable for a phone text. You may use one warm emoji if it fits."
      : "Write a complete but concise email of about 90 to 140 words. No subject line in the body.";

    const prompt = `You are writing a donor thank-you message on behalf of this organization:
${BRAND}

Write ${d.channel === "text" ? "a text message" : "an email"} thanking this donor. Details:
${facts}

Rules:
- Sound genuinely human and heartfelt, never templated or generic.
- Be specific about how the gift helps (reference the Angel Care Bags and the children served).
- ${lengthRule}
- Do NOT use em dashes. Use commas, periods, or separate sentences instead.
- Start directly with the greeting (e.g. "Dear <name>,"). End with a sign-off and the signer.
- Output ONLY the message text, nothing else.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }]
    });

    const text = (message.content && message.content[0] && message.content[0].text) || "";
    res.json({ ok: true, note: text.trim() });
  } catch (err) {
    console.error("Generate error:", err.message);
    res.status(500).json({ ok: false, error: "Could not generate the note. Please try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Angel Thank-You Studio running at http://localhost:${PORT}`);
});
