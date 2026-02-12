"use client";

import { motion } from "framer-motion";
import AudioWaveform from "./AudioWaveform";

const FEATURES = [
    {
        icon: (
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        title: "Lyric Management",
        description:
            "Upload, edit, and version your lyrics in real-time. PDF and text file support with an inline editor that saves instantly.",
    },
    {
        icon: (
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        ),
        title: "Audio Workspace",
        description:
            "Record voice memos, upload MP3 and M4A files, and listen back with a sophisticated, minimalist music player.",
    },
    {
        icon: (
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        title: "Smart Dashboard",
        description:
            "Analytics on your creative output — track by genre, writing style, and project. Keep your work private or share for feedback.",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        },
    },
};

export default function AboutSection() {
    return (
        <section
            id="about"
            className="relative py-32 md:py-40 bg-[#131313]"
        >
            {/* Top divider */}
            <div className="gradient-border w-full mb-20" />

            <div className="max-w-7xl mx-auto px-6 md:px-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center mb-20"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-[#3BC9DB] mb-4 font-medium">
                        Why Writer&apos;s Lair
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-tight">
                        Your Creative Toolkit
                    </h2>
                    <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                        Everything a songwriter needs — lyrics, recordings, and
                        insights — organized in one elegant workspace designed for the
                        creative mind.
                    </p>
                </motion.div>

                {/* Feature cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {FEATURES.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={cardVariants}
                            className="glass-card p-8 lg:p-10 group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-[#3BC9DB]/10 border border-[#3BC9DB]/20 flex items-center justify-center text-[#3BC9DB] mb-6 group-hover:bg-[#3BC9DB]/15 group-hover:border-[#3BC9DB]/30 transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-white/50 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Waveform Visualizer + Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                    className="mt-20 glass-card overflow-hidden"
                >
                    {/* Stats row */}
                    {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 relative z-10">
                        {[
                            { value: "∞", label: "Projects" },
                            { value: "MP3/M4A", label: "Audio Support" },
                            { value: "PDF/TXT", label: "Lyric Formats" },
                            { value: "24/7", label: "Access Anywhere" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-xl md:text-2xl font-semibold text-[#3BC9DB] mb-1 tracking-tight">
                                    {stat.value}
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>*/}
                    {/* Waveform */}
                    <AudioWaveform />
                </motion.div>
            </div>
        </section>
    );
}
