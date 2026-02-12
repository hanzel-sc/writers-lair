"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "Features", href: "#about" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#footer" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* Lock body scroll when mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileOpen]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                ? "bg-[#131313]/80 backdrop-blur-xl border-b border-white/[0.06]"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-20">
                {/* Logo */}
                <a
                    href="#hero"
                    className="text-white/90 font-semibold text-lg tracking-tight flex items-center gap-2"
                >
                    <img
                        src="/media/swj-logo.png"
                        alt="Writer's Lair"
                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                    />
                    Writer&apos;s Lair
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300 tracking-wide"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#about"
                        className="ml-2 px-5 py-2 text-sm font-medium text-[#3BC9DB] border border-[#3BC9DB]/30 rounded-full hover:bg-[#3BC9DB]/10 hover:border-[#3BC9DB]/50 transition-all duration-400"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                    aria-label="Toggle menu"
                >
                    <motion.span
                        animate={
                            isMobileOpen
                                ? { rotate: 45, y: 5 }
                                : { rotate: 0, y: 0 }
                        }
                        className="block w-5 h-[1.5px] bg-white/70 origin-center"
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="block w-5 h-[1.5px] bg-white/70"
                        transition={{ duration: 0.2 }}
                    />
                    <motion.span
                        animate={
                            isMobileOpen
                                ? { rotate: -45, y: -5 }
                                : { rotate: 0, y: 0 }
                        }
                        className="block w-5 h-[1.5px] bg-white/70 origin-center"
                        transition={{ duration: 0.3 }}
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100dvh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="md:hidden fixed inset-0 top-16 bg-[#131313]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 overflow-hidden"
                    >
                        {NAV_LINKS.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08 }}
                                className="text-2xl text-white/70 hover:text-white transition-colors font-medium tracking-tight"
                            >
                                {link.label}
                            </motion.a>
                        ))}
                        <motion.a
                            href="#about"
                            onClick={() => setIsMobileOpen(false)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 px-8 py-3 text-[#3BC9DB] border border-[#3BC9DB]/30 rounded-full text-lg font-medium hover:bg-[#3BC9DB]/10 transition-all"
                        >
                            Get Started
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
