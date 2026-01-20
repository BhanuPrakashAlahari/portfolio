

import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
    id: string | number;
    title: string;
    description?: string;
    imageSrc: string;
    href?: string;
    meta?: string;
    // Extended properties for details view
    longDescription?: string;
    tags?: string[];
    techIcons?: React.ReactNode[];
};

interface FocusRailProps {
    items: FocusRailItem[];
    initialIndex?: number;
    loop?: boolean;
    autoPlay?: boolean;
    interval?: number;
    className?: string;
    onProjectClick?: (item: FocusRailItem) => void;
}

/**
 * Helper to wrap indices (e.g., -1 becomes length-1)
 */
function wrap(min: number, max: number, v: number) {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Physics Configuration
 * Base spring for spatial movement (x/z)
 */
const BASE_SPRING = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
} as const;

/**
 * Scale Spring
 * Bouncier spring specifically for the visual "Click/Tap" feedback on the center card
 */
const TAP_SPRING = {
    type: "spring",
    stiffness: 450,
    damping: 18, // Lower damping = subtle overshoot/wobble "tap"
    mass: 1,
} as const;

export function FocusRail({
    items,
    initialIndex = 0,
    loop = true,
    autoPlay = false,
    interval = 4000,
    className,
    onProjectClick,
}: FocusRailProps) {
    const [active, setActive] = React.useState(initialIndex);
    const [isHovering, setIsHovering] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const count = items.length;
    const activeIndex = wrap(0, count, active);
    const activeItem = items[activeIndex];

    // --- NAVIGATION HANDLERS ---
    const handlePrev = React.useCallback(() => {
        if (!loop && active === 0) return;
        setActive((p) => p - 1);
    }, [loop, active]);

    const handleNext = React.useCallback(() => {
        if (!loop && active === count - 1) return;
        setActive((p) => p + 1);
    }, [loop, active, count]);

    // Autoplay logic
    React.useEffect(() => {
        if (!autoPlay || isHovering) return;
        const timer = setInterval(() => handleNext(), interval);
        return () => clearInterval(timer);
    }, [autoPlay, isHovering, handleNext, interval]);

    // Keyboard navigation
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
    };

    // --- SWIPE / DRAG LOGIC ---
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
        const swipe = swipePower(offset.x, velocity.x);

        if (swipe < -swipeConfidenceThreshold) {
            handleNext();
        } else if (swipe > swipeConfidenceThreshold) {
            handlePrev();
        }
    };

    const visibleIndices = [-2, -1, 0, 1, 2];

    return (
        <div
            className={cn(
                "group relative flex h-[600px] w-full flex-col overflow-hidden text-white outline-none select-none overflow-x-hidden",
                className
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            {/* Main Stage */}
            <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
                {/* DRAGGABLE RAIL CONTAINER */}
                <motion.div
                    className="relative mx-auto flex h-[360px] w-full max-w-6xl items-center justify-center perspective-[1200px] cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={onDragEnd}
                >
                    {visibleIndices.map((offset) => {
                        const absIndex = active + offset;
                        const index = wrap(0, count, absIndex);
                        const item = items[index];

                        if (!loop && (absIndex < 0 || absIndex >= count)) return null;

                        const isCenter = offset === 0;
                        const dist = Math.abs(offset);

                        // Dynamic transforms
                        // Adjust offset based on card width + gap
                        const spacing = isMobile ? 320 : 550; // Mobile: 300px card + 20px gap. Desktop: 500px card + 50px gap
                        const xOffset = offset * spacing;
                        const zOffset = -dist * 180;
                        const scale = isCenter ? 1 : 0.85;
                        const rotateY = offset * -20;

                        const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
                        const blur = isCenter ? 0 : dist * 6;
                        const brightness = isCenter ? 1 : 0.5;

                        return (
                            <motion.div
                                key={absIndex}
                                className={cn(
                                    "absolute aspect-video w-[300px] md:w-[500px] rounded-2xl border-t border-white/20 bg-neutral-900 shadow-2xl transition-shadow duration-300",
                                    isCenter ? "z-20 shadow-white/10 cursor-pointer" : "z-10 cursor-pointer"
                                )}
                                initial={false}
                                animate={{
                                    x: xOffset,
                                    z: zOffset,
                                    scale: scale, // Trigger "tap" via TAP_SPRING when this changes
                                    rotateY: rotateY,
                                    opacity: opacity,
                                    filter: `blur(${blur}px) brightness(${brightness})`,
                                }}
                                transition={{
                                    default: BASE_SPRING,
                                    scale: TAP_SPRING,
                                }}
                                style={{
                                    transformStyle: "preserve-3d",
                                }}
                                onClick={() => {
                                    if (offset !== 0) {
                                        setActive((p) => p + offset);
                                    } else if (onProjectClick) {
                                        onProjectClick(item);
                                    }
                                }}
                            >
                                <img
                                    src={item.imageSrc}
                                    alt={item.title}
                                    className="h-full w-full rounded-2xl object-cover pointer-events-none"
                                />

                                {/* Lighting layers */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                <div className="absolute inset-0 rounded-2xl bg-black/10 pointer-events-none mix-blend-multiply" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Info & Controls */}
                <div className="mx-auto mt-4 md:mt-12 flex w-full max-w-4xl flex-col items-center justify-between gap-4 md:gap-6 md:flex-row pointer-events-auto">
                    <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left h-32 justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeItem.id}
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    {activeItem.meta && (
                                        <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                                            {activeItem.meta}
                                        </span>
                                    )}
                                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
                                        {activeItem.title}
                                    </h2>
                                </div>

                                {activeItem.description && (
                                    <p className="max-w-md text-neutral-400">
                                        {activeItem.description}
                                    </p>
                                )}

                                {activeItem.techIcons && (
                                    <div className="hidden md:flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                                        {activeItem.techIcons.map((icon, idx) => (
                                            <div
                                                key={idx}
                                                className="text-2xl text-neutral-400 p-1 hover:text-white transition-colors"
                                            >
                                                {icon}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 rounded-full bg-neutral-900/80 p-1 ring-1 ring-white/10 backdrop-blur-md">
                            <button
                                onClick={handlePrev}
                                className="rounded-full p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white active:scale-95"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="min-w-[40px] text-center text-xs font-mono text-neutral-500">
                                {activeIndex + 1} / {count}
                            </span>
                            <button
                                onClick={handleNext}
                                className="rounded-full p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white active:scale-95"
                                aria-label="Next"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {activeItem.href && (
                            <a
                                href={activeItem.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
                            >
                                Explore
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
