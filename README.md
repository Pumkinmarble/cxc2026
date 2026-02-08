# Ditto

**Create your AI-powered digital twin that lives forever.**

Ditto lets you build a personalized AI that thinks, speaks, and responds the way you do — grounded in your real personality, memories, and voice. Ask it questions, and it answers as *you* would.

Built for [CxC 2026](https://www.cxc.com/).

## How It Works

Users build their twin through three inputs:

| Input | What it does |
|---|---|
| **Personality Quiz** | 54-question assessment across 5 cognitive dimensions (MBTI + Identity) |
| **Diary Journaling** | Written or voice-transcribed entries that become long-term searchable memory |
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

## Project Structure

```
app/
  page.tsx                  # Root (redirects to /login)
  login/page.tsx            # Auth0 login page
  home/page.tsx             # Main dashboard
  gallery/page.tsx          # Community gallery
  home/components/          # UI components (popups, avatar, toast)
  api/                      # Next.js API routes
AI/
  backboard-client.ts       # Backboard.io API client
  echo-service.ts           # Core AI service
  echo-from-db.ts           # DB-integrated AI initialization
solana_module/
  components/               # Wallet connection, blockchain commit
  lib/                      # Solana utilities
lib/
  auth.ts                   # Auth0 helpers
  db.ts                     # Supabase database utilities
  supabase.ts               # Supabase client configuration
  session.ts                # Session management
utils/
  personalityTest.ts        # Quiz scoring and MBTI type calculation
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Team

- [Harrison Yu](https://www.linkedin.com/in/harrisonyuuw/)
- [Kartheek Chinta](https://www.linkedin.com/in/kartheek-chinta23/)
- [Khush Patel](https://www.linkedin.com/in/khush-patel27/)
- [Rishi Chakrabarty](https://www.linkedin.com/in/rishichakrabarty/)

## License

MIT
