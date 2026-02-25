import { useEffect } from 'react';
import { motion } from 'framer-motion';
import RetroicaFont from '../../assets/fonts/Retroica.ttf';
import useMediaQuery from '../../hooks/useMediaQuery';

interface HeroProps {
    id?: string;
    isLandingComplete?: boolean;
}

const HERO_LINES = ['aakrit', 'cinematic', 'solutions'] as const;

const RETROICA = '"Retroica", Georgia, serif';

const Hero = ({ id = "hero", isLandingComplete = true }: HeroProps) => {
    const isBelowDesktop = useMediaQuery('(max-width: 1023px)');
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.22,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 36, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    // Ensure Retroica font-face is available globally.
    useEffect(() => {
        if (!document.getElementById('retroica-font-face')) {
            const s = document.createElement('style');
            s.id = 'retroica-font-face';
            s.textContent = `@font-face { font-family: 'Retroica'; src: url('${RetroicaFont}') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }`;
            document.head.appendChild(s);
        }
    }, []);

    return (
        <section
            id={id}
            className="relative flex min-h-screen w-screen flex-shrink-0 items-center justify-center overflow-hidden bg-background"
            style={{
                // Always leave at least navbar height + breathing room,
                // and scale with viewport height so zooming doesn't push the title under the navbar.
                paddingTop: 'max(96px, 12dvh)',
            }}
        >
            <motion.div
                className="relative z-10 flex flex-col items-start text-left"
                variants={containerVariants}
                initial={isLandingComplete ? "visible" : "hidden"}
                animate={isLandingComplete ? "visible" : "hidden"}
            >
                <motion.h1
                    className="flex flex-col items-start justify-center font-display font-bold leading-[0.9] text-white"
                    style={{
                        fontSize: 'clamp(1.8rem, 10vw, 12rem)',
                        letterSpacing: '-0.02em'
                    }}
                >
                    {HERO_LINES.map((line) => (
                        <motion.span key={line} variants={itemVariants} className="block">
                            {line}
                        </motion.span>
                    ))}
                </motion.h1>
            </motion.div>

            {/* Subtle "SWIPE" pill hint near bottom center on home hero (mobile + tablet only) */}
            {isLandingComplete && isBelowDesktop && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute inset-x-0 flex justify-center"
                    style={{
                        bottom: 'clamp(1.75rem, 6vh, 3rem)',
                    }}
                >
                    <div
                        className="relative flex items-center justify-center rounded-full px-5 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md"
                        style={{
                            minWidth: '96px',
                            minHeight: '40px',
                            paddingTop: '0.6rem',
                            paddingBottom: '0.6rem',
                            // Glassy, similar to About card but lighter and with no visible outline
                            background:
                                'linear-gradient(145deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.08) 100%)',
                            border: 'none',
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/85"
                                style={{ fontFamily: RETROICA }}
                            >
                                swipe
                            </span>
                            {/* Arrow indicator */}
                            <span
                                aria-hidden="true"
                                className="text-white/85 text-sm leading-none"
                            >
                                →
                            </span>
                        </div>
                        <motion.span
                            aria-hidden="true"
                            initial={{ opacity: 0.6, scaleX: 0.9 }}
                            animate={{ opacity: [0.6, 1, 0.6], scaleX: [0.9, 1.1, 0.9] }}
                            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                            className="ml-2 h-[2px] w-6 rounded-full bg-gradient-to-r from-white/60 to-white"
                        />
                    </div>
                </motion.div>
            )}

        </section>
    );
};

export default Hero;
