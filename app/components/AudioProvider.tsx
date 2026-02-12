"use client";

import {
    createContext,
    useContext,
    useRef,
    useCallback,
    useState,
    useEffect,
    type ReactNode,
    type RefObject,
} from "react";

/* ── Shared Audio State ───────────────────────────────── */
interface SharedAudioState {
    audioRef: RefObject<HTMLAudioElement | null>;
    analyserRef: RefObject<AnalyserNode | null>;
    isPlaying: boolean;
    triggerPlay: () => void;
}

/* Renamed to avoid collision with Web Audio's AudioContext */
const SharedAudioCtx = createContext<SharedAudioState | null>(null);

export function useSharedAudio() {
    const ctx = useContext(SharedAudioCtx);
    if (!ctx) throw new Error("useSharedAudio must be inside AudioProvider");
    return ctx;
}

export default function AudioProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const webCtxRef = useRef<globalThis.AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceCreatedRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const playAttemptRef = useRef(false);

    /* ── Wire up Web Audio analyser (only once, lazily) ──── */
    const ensureWebAudio = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || sourceCreatedRef.current) return;

        try {
            const ctx = new globalThis.AudioContext();
            webCtxRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.82;
            analyserRef.current = analyser;

            const source = ctx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            sourceCreatedRef.current = true;
        } catch (e) {
            console.warn("Web Audio setup failed:", e);
        }
    }, []);

    /* ── Trigger playback (must be called from gesture) ──── */
    const triggerPlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        /* Already playing — nothing to do */
        if (!audio.paused && audio.currentTime > 0) return;

        /* Prevent multiple concurrent attempts */
        if (playAttemptRef.current) return;
        playAttemptRef.current = true;

        /* Set up Web Audio pipeline (first call only) */
        ensureWebAudio();

        /* Resume AudioContext (required after user gesture) */
        const ctx = webCtxRef.current;
        if (ctx && ctx.state === "suspended") {
            ctx.resume().catch(() => { });
        }

        /* Attempt to play */
        audio.volume = 0;
        const p = audio.play();

        if (p && typeof p.then === "function") {
            p.then(() => {
                setIsPlaying(true);
                playAttemptRef.current = false;

                /* Smooth volume fade-in */
                let vol = 0;
                const fade = setInterval(() => {
                    vol = Math.min(vol + 0.007, 0.35);
                    audio.volume = vol;
                    if (vol >= 0.35) clearInterval(fade);
                }, 30);
            }).catch((err) => {
                console.warn("Audio play failed:", err);
                playAttemptRef.current = false;
                /* Don't set isPlaying so the next attempt can try again */
            });
        } else {
            /* Older browsers without promise-based play() */
            setIsPlaying(true);
            playAttemptRef.current = false;
            audio.volume = 0.35;
        }
    }, [ensureWebAudio]);

    /* Cleanup */
    useEffect(() => {
        return () => {
            if (webCtxRef.current) {
                webCtxRef.current.close().catch(() => { });
            }
        };
    }, []);

    return (
        <SharedAudioCtx value={{ audioRef, analyserRef, isPlaying, triggerPlay }}>
            {/* Single shared <audio> element */}
            <audio
                ref={audioRef}
                src="/media/Satie-Embryons-desseches-Fantasie-Valse.mp3"
                loop
                preload="auto"
                style={{ display: "none" }}
            />
            {children}
        </SharedAudioCtx>
    );
}
