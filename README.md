
<p align="center" style="margin-top:4px; margin-bottom:-1000px;">
  <img width="354" height="326" alt="dittologo"
      <img width="519" height="480" alt="dittologoface" src="https://github.com/user-attachments/assets/966d2b01-b515-4ba6-b34c-51b92148714e" />


<h1 align="center">Ditto</h1>
<p align="center">
  Your AI twin that lives forever.
</p>



**Create your AI-powered digital twin that lives forever.**

Ditto lets you build a personalized AI that thinks, speaks, and responds the way you do — grounded in your real personality, memories, and voice. Ask it questions, and it answers as *you* would. The longer you go, the more Ditto will shape to become you.

Winner of [CxC 2026](https://www.cxc.com/) - Best use of ElevenLabs

https://github.com/user-attachments/assets/7925fcf2-5d81-42ae-b475-d17ff6ede40a 


## How It Works

Users build their twin through three inputs:

| Input | What it does |
|---|---|
| **Personality Quiz** | 54-question assessment across 5 cognitive dimensions (MBTI + Identity) |
| **Diary Journaling** | Daily written or voice-transcribed entries that become long-term searchable memory |
| **Voice Recording** | Audio sample used to clone the user's real speaking voice |

Once built, anyone can talk to the twin and get responses that reflect the real person's personality, memories, and voice.

## Architecture

```
Next.js (Frontend)
  |
  +-- Auth0 (Authentication)
  +-- Three.js / React Three Fiber (3D Avatar)
  +-- Tailwind CSS (Styling)
  |
API Routes (Backend)
  |
  +-- Backboard.io (RAG Memory + Google Gemini LLM)
  +-- ElevenLabs (Voice Cloning + TTS + Transcription)
  +-- Supabase / PostgreSQL (Data Storage)
  +-- Solana Devnet (Blockchain Identity Verification)
```

### AI Pipeline

1. **Personality modeling** — Quiz results are scored into a type (e.g. INFP-T) and formatted into a system prompt that instructs the LLM to embody the user's personality, emotional style, and communication patterns.

2. **Memory (RAG)** — Diary entries are embedded into Backboard.io's vector store. When a question is asked, the most relevant entries are retrieved and injected as context alongside the personality prompt.

3. **Generation** — The combined context is sent to Google Gemini, which generates a response grounded in both personality and real memories.

4. **Voice synthesis** — The response is spoken aloud using the user's cloned voice via ElevenLabs TTS, with real-time lip-sync on the 3D avatar.

### Blockchain

Users can optionally commit a SHA-256 hash of their twin's data to Solana, creating a permanent, verifiable proof of identity without exposing personal data on-chain.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, TypeScript, React 18 |
| Styling | Tailwind CSS, custom glassmorphism design system |
| 3D | Three.js, React Three Fiber, Drei |
| Auth | Auth0 (OAuth, Google SSO) |
| Database | Supabase (PostgreSQL) |
| AI / LLM | Backboard.io (RAG), Google Gemini |
| Voice | ElevenLabs (cloning, TTS, Scribe v2 transcription) |
| Blockchain | Solana (Devnet), Phantom / Solflare wallets |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/cxc2026.git
cd cxc2026

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys (see .env.example for details)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for all required keys:

- **Auth0** — Authentication
- **Supabase** — Database
- **Backboard.io** — AI memory and RAG
- **ElevenLabs** — Voice cloning and TTS
- **Solana RPC** — Blockchain (optional)

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```
## Future implementations
- A community market where people (like celebrities, professors, politicians) can create and post their AI twins. Allowing people to talk to them as if they were face-to-face in real life. It can be charged via Solona or other forms of currency.
## Team

- [Harrison Yu](https://www.linkedin.com/in/harrisonyuuw/)
- [Kartheek Chinta](https://www.linkedin.com/in/kartheek-chinta23/)
- [Khush Patel](https://www.linkedin.com/in/khush-patel27/)
- [Rishi Chakrabarty](https://www.linkedin.com/in/rishichakrabarty/)

## License

MIT

DISCLAIMER: We do not condone any immoral and improper use of Ditto. Please always use responsibly.
