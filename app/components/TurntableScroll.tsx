"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSharedAudio } from "./AudioProvider";

const TOTAL_FRAMES = 240;

/* ── Narrative overlay sections ────────────────────────── */
interface NarrativePhase {
    start: number;
    end: number;
    fadeIn: number;
    fadeOut: number;
    position: "center" | "left" | "right";
    headline: string;
    subtext: string;
    showCTA?: boolean;
}

const NARRATIVE_PHASES: NarrativePhase[] = [
    {
        start: 0,
        end: 0.2,
        fadeIn: 0,
        fadeOut: 0.18,
        position: "center",
        headline: "Writer\u2019s Lair.",
        subtext: "Capture ideas before they fade.",
    },
    {
        start: 0.25,
        end: 0.45,
        fadeIn: 0.27,
        fadeOut: 0.43,
        position: "left",
        headline: "Organize Your Creativity.",
        subtext: "Lyrics. Notes. Versions.",
    },
    {
        start: 0.5,
        end: 0.7,
        fadeIn: 0.52,
        fadeOut: 0.68,
        position: "right",
        headline: "Everything In One Place.",
        subtext: "Lyrics. Voice Memos. Audio Files.",
    },
    {
        start: 0.8,
        end: 1.0,
        fadeIn: 0.82,
        fadeOut: 1.0,
        position: "center",
        headline: "Never Lose an Idea.",
        subtext: "Start Your Next Song.",
        showCTA: true,
    },
];

export default function TurntableScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const hasReachedEndRef = useRef(false);

    const { triggerPlay, isPlaying, audioRef: sharedAudioRef } = useSharedAudio();

    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [showAudioPrompt, setShowAudioPrompt] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    /* ── Preload all 240 frames in batches ──────────────── */
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        let cancelled = false;

        const BATCH_SIZE = 20;
        let batchStart = 0;

        function loadBatch() {
            if (cancelled) return;
            const end = Math.min(batchStart + BATCH_SIZE, TOTAL_FRAMES);

            for (let i = batchStart; i < end; i++) {
                const img = new Image();
                img.decoding = "async";
                const padded = String(i + 1).padStart(3, "0");
                img.src = `/turntable-sequence-png/ezgif-frame-${padded}.png`;

                img.onload = () => {
                    if (cancelled) return;
                    loadedCount++;
                    if (loadedCount % 10 === 0 || loadedCount === TOTAL_FRAMES) {
                        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    }

                    if (loadedCount === TOTAL_FRAMES) {
                        imagesRef.current = images;
                        setIsLoading(false);
                        drawFrame(0, images);
                    }
                };

                img.onerror = () => {
                    if (cancelled) return;
                    loadedCount++;
                    if (loadedCount % 10 === 0 || loadedCount === TOTAL_FRAMES) {
                        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    }
                };

                images[i] = img;
            }

            batchStart = end;
            if (batchStart < TOTAL_FRAMES) {
                setTimeout(loadBatch, 0);
            }
        }

        loadBatch();

        return () => {
            cancelled = true;
            imagesRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Draw a frame using COVER fit + Veo crop ───────── */
    const drawFrame = useCallback(
        (index: number, images?: HTMLImageElement[]) => {
            const canvas = canvasRef.current;
            const imgs = images || imagesRef.current;
            const img = imgs[index];
            if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const dpr = window.devicePixelRatio || 1;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            /* Crop bottom 8% of source to remove Veo watermark */
            const cropRatio = 0.92;
            const srcFullW = img.naturalWidth;
            const srcFullH = img.naturalHeight * cropRatio;
            const srcAspect = srcFullW / srcFullH;
            const viewportAspect = vw / vh;

            /* COVER fit: fill viewport completely, crop excess */
            let sx = 0, sy = 0, sw = srcFullW, sh = srcFullH;

            if (viewportAspect > srcAspect) {
                const visibleH = srcFullW / viewportAspect;
                sy = (srcFullH - visibleH) / 2;
                sh = visibleH;
            } else {
                const visibleW = srcFullH * viewportAspect;
                sx = (srcFullW - visibleW) / 2;
                sw = visibleW;
            }

            const targetW = Math.round(vw * dpr);
            const targetH = Math.round(vh * dpr);

            if (canvas.width !== targetW || canvas.height !== targetH) {
                canvas.width = targetW;
                canvas.height = targetH;
                canvas.style.width = `${vw}px`;
                canvas.style.height = `${vh}px`;
            }

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, vw, vh);
        },
        []
    );

    /* ── Handle resize ──────────────────────────────────── */
    useEffect(() => {
        const handleResize = () => drawFrame(currentFrameRef.current);
        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, [drawFrame]);

    /* ── Hide audio prompt once playing ────────────────── */
    useEffect(() => {
        if (isPlaying) setShowAudioPrompt(false);
    }, [isPlaying]);

    /* ── Scroll → frame render loop ─────────────────────── */
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (progress) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                const images = imagesRef.current;
                if (images.length === 0) return;

                const frameIndex = Math.min(
                    TOTAL_FRAMES - 1,
                    Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1)))
                );

                if (frameIndex !== currentFrameRef.current) {
                    currentFrameRef.current = frameIndex;
                    drawFrame(frameIndex);
                }

                /* Trigger audio at 95% scroll (turntable assembled) */
                if (progress >= 0.95 && !hasReachedEndRef.current) {
                    hasReachedEndRef.current = true;
                    triggerPlay();
                    /* Check actual audio element state (avoids stale closure) */
                    setTimeout(() => {
                        const audio = sharedAudioRef.current;
                        if (!audio || audio.paused) {
                            setShowAudioPrompt(true);
                        }
                    }, 500);
                }
            });
        });

        return () => {
            unsubscribe();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [scrollYProgress, drawFrame, triggerPlay, sharedAudioRef]);

    /* ── Compute opacity for overlays ──────────────────── */
    const getOpacity = useCallback(
        (progress: number, phase: NarrativePhase): number => {
            if (progress < phase.start || progress > phase.end) return 0;

            const fadeInDuration = phase.fadeIn - phase.start;
            const fadeOutStart = phase.fadeOut;

            if (progress < phase.fadeIn) {
                return fadeInDuration > 0
                    ? (progress - phase.start) / fadeInDuration
                    : 1;
            }
            if (progress > fadeOutStart) {
                const fadeOutDuration = phase.end - fadeOutStart;
                return fadeOutDuration > 0
                    ? 1 - (progress - fadeOutStart) / fadeOutDuration
                    : 0;
            }
            return 1;
        },
        []
    );

    const phase0Opacity = useTransform(scrollYProgress, (p) =>
        getOpacity(p, NARRATIVE_PHASES[0])
    );
    const phase1Opacity = useTransform(scrollYProgress, (p) =>
        getOpacity(p, NARRATIVE_PHASES[1])
    );
    const phase2Opacity = useTransform(scrollYProgress, (p) =>
        getOpacity(p, NARRATIVE_PHASES[2])
    );
    const phase3Opacity = useTransform(scrollYProgress, (p) =>
        getOpacity(p, NARRATIVE_PHASES[3])
    );

    const ctaOpacity = useTransform(scrollYProgress, (p) => {
        if (p < 0.85) return 0;
        return Math.min(1, (p - 0.85) / 0.1);
    });

    const opacities = [phase0Opacity, phase1Opacity, phase2Opacity, phase3Opacity];

    const getPositionClasses = (position: string) => {
        switch (position) {
            case "left":
                return "items-start text-left pl-6 md:pl-20 lg:pl-32";
            case "right":
                return "items-end text-right pr-6 md:pr-20 lg:pr-32";
            default:
                return "items-center text-center";
        }
    };

    return (
        <section ref={containerRef} className="relative h-[500vh]" id="hero">
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#131313]">
                {/* Loading spinner */}
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#131313]">
                        <div className="relative mb-6">
                            <div className="w-12 h-12 rounded-full border-2 border-[#4B4A48] border-t-[#3BC9DB] animate-spin" />
                        </div>
                        <p className="text-sm tracking-widest uppercase text-white/40 font-medium">
                            Loading Experience
                        </p>
                        <p className="mt-2 text-xs text-white/25 tabular-nums">
                            {loadProgress}%
                        </p>
                    </div>
                )}

                {/* Canvas – full viewport cover */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ willChange: "transform" }}
                />

                {/* Audio prompt */}
                {showAudioPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50"
                    >
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                triggerPlay();
                                setShowAudioPrompt(false);
                            }}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#262625]/80 backdrop-blur-sm border border-[#3BC9DB]/20 rounded-full text-[#3BC9DB] text-[11px] sm:text-xs tracking-wider uppercase hover:bg-[#262625] hover:border-[#3BC9DB]/40 transition-all duration-300 cursor-pointer"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                            Tap to enable sound
                        </button>
                    </motion.div>
                )}

                {/* Text Overlays */}
                {NARRATIVE_PHASES.map((phase, idx) => (
                    <motion.div
                        key={idx}
                        style={{ opacity: opacities[idx] }}
                        className={`absolute inset-0 flex flex-col justify-center pointer-events-none px-4 sm:px-6 z-10 ${getPositionClasses(
                            phase.position
                        )}`}
                    >
                        <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white/90 mb-3 sm:mb-4 leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
                            {phase.headline}
                        </h2>
                        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/60 max-w-[280px] sm:max-w-md leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]">
                            {phase.subtext}
                        </p>
                        {phase.showCTA && (
                            <motion.a
                                href="#about"
                                style={{ opacity: ctaOpacity }}
                                className="pointer-events-auto mt-6 sm:mt-8 inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#131313]/60 border border-[#3BC9DB]/30 rounded-full text-[#3BC9DB] text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-[#3BC9DB]/20 hover:border-[#3BC9DB]/50 transition-all duration-500 self-center backdrop-blur-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Started
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.a>
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
