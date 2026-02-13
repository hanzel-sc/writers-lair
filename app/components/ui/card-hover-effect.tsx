"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export const HoverEffect = ({
    items,
    className,
}: {
    items: {
        title: string;
        description: string;
        icon?: React.ReactNode;
        link?: string;
    }[];
    className?: string;
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={clsx(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
                className
            )}
        >
            {items.map((item, idx) => (
                <div
                    key={item.title}
                    className="relative group block p-2"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-[#3BC9DB]/[0.08] block rounded-2xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        {item.icon && (
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[#3BC9DB]/10 border border-[#3BC9DB]/20 flex items-center justify-center text-[#3BC9DB] mb-4 sm:mb-5 group-hover:bg-[#3BC9DB]/15 group-hover:border-[#3BC9DB]/30 transition-all duration-500">
                                {item.icon}
                            </div>
                        )}
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export const Card = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={clsx(
                "rounded-2xl h-full w-full p-5 sm:p-6 lg:p-8 overflow-hidden bg-[#0a0a0a]/80 border border-white/[0.06] group-hover:border-[#3BC9DB]/20 relative z-20 transition-all duration-300",
                className
            )}
        >
            <div className="relative z-50">
                <div className="p-1">{children}</div>
            </div>
        </div>
    );
};

export const CardTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <h4
            className={clsx(
                "text-white/90 font-semibold tracking-tight text-lg sm:text-xl mb-2 sm:mb-3",
                className
            )}
        >
            {children}
        </h4>
    );
};

export const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className={clsx(
                "text-white/40 tracking-wide leading-relaxed text-sm",
                className
            )}
        >
            {children}
        </p>
    );
};
