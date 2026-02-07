# Echo Voice Module (ElevenLabs)

This folder contains a standalone voice cloning + TTS module for the Echo hackathon project. It is designed to be copied into the main Next.js App Router app later, but can be developed in isolation here.

## How to run
1. From the repo root, run `npm run dev` (standard Next.js dev server).
2. Ensure this module is copied into the main app later. Once integrated, visit:
   - `/voice-test`

## Environment variable
Set the following in your environment (server-side only):
- `ELEVENLABS_API_KEY`

## API contract summary
### POST `/api/voice/clone`
- Request: `multipart/form-data`
  - `audio`: File (accepts `audio/webm`, `audio/wav`, `audio/mpeg`, `audio/mp4`)
  - `name`: optional string voice name
- Response JSON:
  ```json
  { "voice_id": "..." }
  ```

### POST `/api/voice/speak`
- Request: `application/json`
  ```json
  { "voice_id": "...", "text": "..." }
  ```
- Response: audio bytes (`Content-Type: audio/mpeg` or `audio/wav`)

## Notes
- The ElevenLabs API key is never exposed client-side.
- The demo page keeps `voice_id` in React state only.
