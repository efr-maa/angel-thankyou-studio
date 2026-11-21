# Angel Thank-You Studio

An AI-powered web app that helps a nonprofit write warm, personalized donor thank-you messages in seconds, for email or text, so no donor ever goes unthanked.

Built as a volunteer project for **Myra's Angels Foundation**, a 501(c)(3) nonprofit in Wake Forest, NC that provides "Angel Care Bags" of essential and comfort items to foster children and children experiencing homelessness.

## Why I built it

Myra's Angels is run by a small team, and writing individual thank-you notes to donors was taking hours of time that could go toward serving children. Some donors were unintentionally missed. I built this tool to turn a donor's details into a heartfelt, on-brand thank-you message instantly, while keeping a human in control of every message before it is sent.

## What it does

- **Writes a fresh, personal note with AI.** Enter the donor's name, what they gave (items, money, or both), the occasion, and a tone, and the tool generates a warm, non-templated thank-you in the Foundation's own voice.
- **Email or text.** Switch between a full email and a short, friendly text message.
- **Fully editable.** Every generated note can be edited in place before copying.
- **Saved history.** Save each thank-you to a local history list, then reopen, copy, or delete any past note, so the team can track who has been thanked.
- **Private by design.** Notes are generated on demand and nothing is sent automatically; the user copies the finished message into their own email or messaging app.

## How it works

The app has a small, secure architecture so the AI key is never exposed to the browser:

```
Browser (index.html)  ->  Node/Express backend (server.js)  ->  Claude API
```

1. The front end collects the donor details and sends them to the backend.
2. The backend holds the secret API key, builds a prompt with the Foundation's real mission and voice, and calls the Claude API.
3. The generated note is returned to the page, where it can be edited, copied, and saved.

The API key lives only in a local `.env` file (git-ignored) and, in production, in the host's environment variables, so it never reaches the browser or the repository.

## Built with

- **JavaScript** (vanilla front end, no framework)
- **Node.js** and **Express** for the backend
- **Claude API** (`@anthropic-ai/sdk`) for message generation
- **HTML5 / CSS3** with a responsive, accessible, light/dark design
- **dotenv** for secure environment configuration

## Running it locally

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file with your Anthropic API key
#    ANTHROPIC_API_KEY=your-key-here

# 3. Start the server
node server.js

# 4. Open http://localhost:3000 in your browser
```

## Roadmap

- One-click "open in email / WhatsApp" with the message prefilled
- Deployment to a public URL for the Foundation to use
- Optional browser extension for use alongside Gmail and Outlook

## Author

Built by **Elizabeth Frimpomaa**, Computer Science student at Meredith College, as a volunteer contribution to Myra's Angels Foundation.

> One bag full of love creates a child full of hope.
