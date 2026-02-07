import { NextRequest, NextResponse } from "next/server";
import { cloneVoice, ElevenLabsError } from "../../../../lib/elevenlabs";

export const runtime = "nodejs";

const ACCEPTED_TYPES = [
  "audio/webm",
  "audio/wav",
  "audio/mpeg",
  "audio/mp4",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");
    const name = formData.get("name");

    if (!audio || !(audio instanceof File)) {
      return NextResponse.json(
        { error: "Missing audio file" },
        { status: 400 }
      );
    }

    if (audio.type && !ACCEPTED_TYPES.includes(audio.type)) {
      return NextResponse.json(
        { error: `Unsupported audio type: ${audio.type}` },
        { status: 400 }
      );
    }

    const result = await cloneVoice({
      audio,
      name: typeof name === "string" ? name : undefined,
    });

    return NextResponse.json({ voice_id: result.voice_id });
  } catch (err) {
    if (err instanceof ElevenLabsError) {
      return NextResponse.json(
        { error: err.message || "ElevenLabs error" },
        { status: err.status || 502 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
