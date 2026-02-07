"use client";

import { useEffect, useState } from "react";

interface EchoLogoProps {
  size?: number;
  isActive?: boolean; // true when AI is thinking/speaking
}

export default function EchoLogo({ size = 48, isActive = false }: EchoLogoProps) {
  const [frame, setFrame] = useState(0);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Wobbly blob path — shifts based on frame
  const wobble1 = Math.sin((frame * Math.PI) / 60) * 3;
  const wobble2 = Math.cos((frame * Math.PI) / 45) * 2.5;
  const wobble3 = Math.sin((frame * Math.PI) / 50) * 2;
  const wobble4 = Math.cos((frame * Math.PI) / 55) * 3;

  // Blob control points (Ditto-shaped amorphous blob)
  const blobPath = `
    M ${24 + wobble1} ${8 + wobble2}
    C ${34 + wobble3} ${6 + wobble1}, ${40 + wobble2} ${14 + wobble3}, ${41 + wobble4} ${22 + wobble1}
    C ${42 + wobble1} ${30 + wobble2}, ${38 + wobble3} ${38 + wobble4}, ${32 + wobble2} ${41 + wobble1}
    C ${26 + wobble4} ${44 + wobble2}, ${18 + wobble1} ${44 + wobble3}, ${12 + wobble2} ${41 + wobble4}
    C ${6 + wobble3} ${38 + wobble1}, ${4 + wobble4} ${30 + wobble2}, ${5 + wobble1} ${22 + wobble3}
    C ${6 + wobble2} ${14 + wobble4}, ${14 + wobble3} ${10 + wobble1}, ${24 + wobble1} ${8 + wobble2}
    Z
  `;

  // Eye positions wobble slightly
  const eyeOffsetX = Math.sin((frame * Math.PI) / 80) * 0.5;
  const eyeOffsetY = Math.cos((frame * Math.PI) / 70) * 0.3;

  // Mouth animation — opens wider when active (speaking)
  const mouthWidth = isActive
    ? 4 + Math.abs(Math.sin((frame * Math.PI) / 8)) * 3 // fast open/close when speaking
    : 5 + Math.sin((frame * Math.PI) / 90) * 1; // gentle idle smile
  const mouthHeight = isActive
    ? 1.5 + Math.abs(Math.sin((frame * Math.PI) / 8)) * 2.5
    : 0.8;

  // Color shifts slightly when active
  const blobColor = isActive ? "#a78bfa" : "#c4b5fd"; // purple shades (Ditto-like)
  const blobColorDark = isActive ? "#7c3aed" : "#8b5cf6";

  // Pulse scale when active
  const scale = isActive ? 1 + Math.sin((frame * Math.PI) / 15) * 0.04 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `scale(${scale})`, transition: "transform 0.1s" }}
    >
      {/* Shadow */}
      <ellipse
        cx="24"
        cy="43"
        rx={isActive ? 12 : 10}
        ry="2.5"
        fill="rgba(0,0,0,0.08)"
      />

      {/* Main blob body */}
      <path
        d={blobPath}
        fill={blobColor}
        stroke={blobColorDark}
        strokeWidth="1"
      />

      {/* Shiny highlight */}
      <ellipse
        cx={16 + wobble1 * 0.3}
        cy={16 + wobble2 * 0.3}
        rx="3"
        ry="2"
        fill="rgba(255,255,255,0.35)"
        transform={`rotate(-20 ${16 + wobble1 * 0.3} ${16 + wobble2 * 0.3})`}
      />

      {/* Left eye — Ditto dot style */}
      <circle
        cx={18 + eyeOffsetX}
        cy={24 + eyeOffsetY}
        r="1.8"
        fill="#1e1b4b"
      />

      {/* Right eye */}
      <circle
        cx={30 + eyeOffsetX}
        cy={24 + eyeOffsetY}
        r="1.8"
        fill="#1e1b4b"
      />

      {/* Mouth — line when idle, open when speaking */}
      <ellipse
        cx={24 + eyeOffsetX * 0.5}
        cy={30 + eyeOffsetY * 0.5}
        rx={mouthWidth}
        ry={mouthHeight}
        fill={isActive ? "#1e1b4b" : "none"}
        stroke="#1e1b4b"
        strokeWidth={isActive ? 0 : 1.2}
      />

      {/* Sound wave rings when speaking */}
      {isActive && (
        <>
          <circle
            cx="24"
            cy="24"
            r={22 + (frame % 30)}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="0.8"
            opacity={Math.max(0, 1 - (frame % 30) / 30)}
          />
          <circle
            cx="24"
            cy="24"
            r={22 + ((frame + 15) % 30)}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="0.6"
            opacity={Math.max(0, 1 - ((frame + 15) % 30) / 30)}
          />
        </>
      )}
    </svg>
  );
}
