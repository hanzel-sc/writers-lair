"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSharedAudio } from "./AudioProvider";

/* ── Configuration ──────────────────────────────────── */
const BAR_COUNT = 80;
const BAR_GAP = 3;
const MIN_BAR_HEIGHT = 4;
const MAX_BAR_HEIGHT_RATIO = 0.85;

/* Color stops (bottom → top) */
const COLOR_BOTTOM = { r: 19, g: 19, b: 19 };
const COLOR_MID = { r: 30, g: 120, b: 180 };
const COLOR_TOP = { r: 59, g: 201, b: 219 };

function lerpColor(
    a: { r: number; g: number; b: number },
    b: { r: number; g: number; b: number },
    t: number
) {
    return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t),
    };
}

export default function AudioWaveform() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const smoothedDataRef = useRef<Float32Array | null>(null);

    /* ── Use the shared analyser from AudioProvider ─────── */
    const { analyserRef } = useSharedAudio();

    /* ── Draw loop ───────────────────────────────────────── */
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const analyser = analyserRef.current;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const bufferLength = analyser ? analyser.frequencyBinCount : BAR_COUNT;
        const dataArray = new Uint8Array(bufferLength);

        if (analyser) {
            analyser.getByteFrequencyData(dataArray);
        }

        /* Initialize smoothed data */
        if (!smoothedDataRef.current || smoothedDataRef.current.length !== BAR_COUNT) {
            smoothedDataRef.current = new Float32Array(BAR_COUNT);
        }

        const smoothed = smoothedDataRef.current;
        const barWidth = (w - (BAR_COUNT - 1) * BAR_GAP) / BAR_COUNT;
        const maxH = h * MAX_BAR_HEIGHT_RATIO;
        const centerY = h / 2;

        for (let i = 0; i < BAR_COUNT; i++) {
            const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength);
            const raw = (dataArray[dataIndex] || 0) / 255;

            /* Smooth animation */
            smoothed[i] = smoothed[i] * 0.7 + raw * 0.3;
            const val = smoothed[i];

            const barH = Math.max(MIN_BAR_HEIGHT, val * maxH);
            const x = i * (barWidth + BAR_GAP);
            const halfH = barH / 2;

            /* Gradient per bar */
            const intensity = val;
            const grad = ctx.createLinearGradient(x, centerY + halfH, x, centerY - halfH);

            const bottomColor = lerpColor(COLOR_BOTTOM, COLOR_MID, intensity * 0.5);
            const topColor = lerpColor(COLOR_MID, COLOR_TOP, intensity);

            grad.addColorStop(0, `rgba(${bottomColor.r}, ${bottomColor.g}, ${bottomColor.b}, 0.15)`);
            grad.addColorStop(0.3, `rgba(${COLOR_MID.r}, ${COLOR_MID.g}, ${COLOR_MID.b}, ${0.4 + intensity * 0.4})`);
            grad.addColorStop(0.7, `rgba(${topColor.r}, ${topColor.g}, ${topColor.b}, ${0.6 + intensity * 0.35})`);
            grad.addColorStop(1, `rgba(${COLOR_TOP.r}, ${COLOR_TOP.g}, ${COLOR_TOP.b}, ${0.7 + intensity * 0.3})`);

            ctx.fillStyle = grad;

            /* Upper bar with rounded top */
            ctx.beginPath();
            const radius = Math.min(barWidth / 2, 2);
            const uy = centerY - halfH;
            ctx.moveTo(x + radius, uy);
            ctx.lineTo(x + barWidth - radius, uy);
            ctx.quadraticCurveTo(x + barWidth, uy, x + barWidth, uy + radius);
            ctx.lineTo(x + barWidth, centerY);
            ctx.lineTo(x, centerY);
            ctx.lineTo(x, uy + radius);
            ctx.quadraticCurveTo(x, uy, x + radius, uy);
            ctx.fill();

            /* Lower bar (mirror reflection) */
            const reflectionH = halfH * 0.45;
            const reflGrad = ctx.createLinearGradient(x, centerY, x, centerY + reflectionH);

            reflGrad.addColorStop(0, `rgba(${topColor.r}, ${topColor.g}, ${topColor.b}, ${0.3 + intensity * 0.2})`);
            reflGrad.addColorStop(1, `rgba(${COLOR_BOTTOM.r}, ${COLOR_BOTTOM.g}, ${COLOR_BOTTOM.b}, 0)`);

            ctx.fillStyle = reflGrad;
            ctx.fillRect(x, centerY + 1, barWidth, reflectionH);

            /* Glow dot at tip */
            if (intensity > 0.3) {
                ctx.shadowColor = `rgba(59, 201, 219, ${intensity * 0.5})`;
                ctx.shadowBlur = 8;
                ctx.fillStyle = `rgba(59, 201, 219, ${intensity * 0.6})`;
                ctx.fillRect(x, uy, barWidth, 2);
                ctx.shadowBlur = 0;
            }
        }

        /* Horizontal center line */
        const lineGrad = ctx.createLinearGradient(0, centerY, w, centerY);
        lineGrad.addColorStop(0, "rgba(59, 201, 219, 0)");
        lineGrad.addColorStop(0.2, "rgba(59, 201, 219, 0.15)");
        lineGrad.addColorStop(0.5, "rgba(59, 201, 219, 0.25)");
        lineGrad.addColorStop(0.8, "rgba(59, 201, 219, 0.15)");
        lineGrad.addColorStop(1, "rgba(59, 201, 219, 0)");
        ctx.fillStyle = lineGrad;
        ctx.fillRect(0, centerY - 0.5, w, 1);

        rafRef.current = requestAnimationFrame(draw);
    }, [analyserRef]);

    /* ── Start draw loop on mount ──────────────────────── */
    useEffect(() => {
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [draw]);

    return (
        <div className="w-full relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-1/2 rounded-full bg-[#3BC9DB]/[0.03] blur-3xl" />
            </div>
            <canvas
                ref={canvasRef}
                className="w-full h-[100px] sm:h-[130px] md:h-[180px] lg:h-[200px]"
                style={{
                    background: "transparent",
                    willChange: "transform",
                }}
            />
        </div>
    );
}
