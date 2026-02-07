"use client";

import { useEffect, useRef, useState } from "react";
import VoiceRecorder from "../../components/VoiceRecorder";

const DEFAULT_SCRIPT =
  "Hello! This is my Echo voice sample. I'm excited to share a few memories and stories from my life. I grew up loving music, long walks, and late-night conversations with friends. Over the years, I learned to value curiosity, kindness, and showing up for the people I care about. This recording will help my digital twin speak in a way that feels like me.";

export default function VoiceTestPage() {
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [ttsText, setTtsText] = useState("Thanks for listening. This is Echo speaking with my cloned voice.");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleSpeak = async () => {
    if (!voiceId) return;
    setIsSpeaking(true);
    setError(null);

    try {
      const res = await fetch("/api/voice/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voice_id: voiceId, text: ttsText }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate speech");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      requestAnimationFrame(() => {
        audioRef.current?.play();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speech failed");
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleReplay = () => {
    audioRef.current?.play();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Echo Voice Module</p>
          <h1 className="text-3xl font-semibold">Voice cloning + TTS demo</h1>
          <p className="text-sm text-slate-600">
            Record a short sample, generate a cloned voice with ElevenLabs, then speak any text.
          </p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">Recommended script (30-60 seconds)</p>
          <p className="mt-2 text-sm text-slate-600">{DEFAULT_SCRIPT}</p>
        </section>

        <VoiceRecorder onVoiceCloned={setVoiceId} />

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-900">Voice ID</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {voiceId || "Not created yet"}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tts-text">
              Text to speak
            </label>
            <textarea
              id="tts-text"
              rows={4}
              value={ttsText}
              onChange={(event) => setTtsText(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              placeholder="Type the text you want Echo to speak"
              disabled={isSpeaking}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-emerald-300"
                onClick={handleSpeak}
                disabled={!voiceId || !ttsText.trim() || isSpeaking}
                type="button"
              >
                {isSpeaking ? "Speaking..." : "Speak"}
              </button>
              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
                onClick={handleReplay}
                disabled={!audioUrl || isSpeaking}
                type="button"
              >
                Replay
              </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="mt-4">
            <audio ref={audioRef} controls src={audioUrl || undefined} className="w-full" />
          </div>
        </section>
      </div>
    </div>
  );
}
