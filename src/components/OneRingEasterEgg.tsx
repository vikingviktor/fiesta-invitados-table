import React, { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

/**
 * 🔥 Easter Egg del Anillo Único 🔥
 *
 * Al hacer clic en el anillo se dispara la secuencia:
 *   1. Vibración (shake) del icono del anillo
 *   2. Aparición del Ojo de Sauron en el centro
 *   3. Inscripción élfica brillando en rojo alrededor
 *   4. Efecto espectral global (grayscale + blur en body) durante ~2s
 *   5. Reset suave tras 3s
 *
 * La imagen del Ojo de Sauron debe estar en /public/eye-of-sauron.jpg
 * Audio opcional: colocar /public/sauron-whisper.mp3
 */

const INSCRIPTION_TEXT = "Ash nazg durbatulûk, ash nazg gimbatul, ash nazg thrakatulûk, agh burzum-ishi krimpatul";

const OneRingEasterEgg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"idle" | "shake" | "eye" | "fade-out">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const trigger = useCallback(() => {
    if (active) return;
    setActive(true);

    // --- Fase 1: Shake (0 → 600ms) ---
    setPhase("shake");

    // --- Audio (opcional) ---
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sauron-whisper.mp3");
        audioRef.current.volume = 0.4;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {
      /* no audio file, no problem */
    }

    // --- Fase 2: Ojo de Sauron + Inscripción + Efecto espectral (600ms → 2600ms) ---
    const t1 = setTimeout(() => {
      setPhase("eye");
      document.body.classList.add("sauron-spectral");
    }, 600);

    // --- Fase 3: Fade-out (2600ms → 3200ms) ---
    const t2 = setTimeout(() => {
      setPhase("fade-out");
      document.body.classList.remove("sauron-spectral");
      document.body.classList.add("sauron-spectral-exit");
    }, 2600);

    // --- Reset completo (3200ms) ---
    const t3 = setTimeout(() => {
      setPhase("idle");
      setActive(false);
      document.body.classList.remove("sauron-spectral-exit");
    }, 3200);

    timeoutsRef.current = [t1, t2, t3];

    return () => clearAllTimeouts();
  }, [active, clearAllTimeouts]);

  return (
    <div
      className="one-ring-easter-egg"
      onClick={trigger}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && trigger()}
      style={{ cursor: active ? "default" : "pointer", position: "relative", display: "inline-block" }}
    >
      {/* El icono original del anillo */}
      <div className={phase === "shake" ? "sauron-ring-shake" : ""}>
        {children}
      </div>

      {/* ── Overlay del Ojo de Sauron (rendered via Portal to body) ── */}
      {(phase === "eye" || phase === "fade-out") && createPortal(
        <div className={`sauron-overlay ${phase === "fade-out" ? "sauron-overlay--exit" : ""}`}>
          {/* Ojo de Sauron */}
          <div className="sauron-eye-container">
            <img
              src="/eye-of-sauron.jpg"
              alt="Eye of Sauron"
              className="sauron-eye-img"
            />
            {/* Fallback gradiente si no hay imagen */}
            <div className="sauron-eye-gradient" />
          </div>

          {/* Inscripción élfica circular */}
          <svg
            className="sauron-inscription"
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path
                id="inscription-circle"
                d="M 150,150 m -120,0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
              />
              <filter id="glow-red">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <text
              filter="url(#glow-red)"
              fill="#ff2200"
              fontSize="11.5"
              fontFamily="'Uncial Antiqua', 'Aniron', serif"
              letterSpacing="1.5"
            >
              <textPath href="#inscription-circle" startOffset="0%">
                {INSCRIPTION_TEXT}
              </textPath>
            </text>
          </svg>
        </div>,
        document.body
      )}
    </div>
  );
};

export default OneRingEasterEgg;
