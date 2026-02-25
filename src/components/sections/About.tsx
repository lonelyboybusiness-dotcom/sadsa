import { useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useMediaQuery from '../../hooks/useMediaQuery';
import RetroicaFont from '../../assets/fonts/Retroica.ttf';
import CalistoFont from '../../assets/fonts/Calisto.ttf';

const RETROICA = '"Retroica", Georgia, serif';

interface AboutProps {
    id?: string;
    className?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
};

const About = ({ id = 'about', className }: AboutProps) => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const isTablet = useMediaQuery('(min-width: 600px) and (max-width: 1023px)');

    useEffect(() => {
        if (!document.getElementById('retroica-font-face')) {
            const s = document.createElement('style');
            s.id = 'retroica-font-face';
            s.textContent = `@font-face { font-family: 'Retroica'; src: url('${RetroicaFont}') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }`;
            document.head.appendChild(s);
        }
        if (!document.getElementById('calisto-font-face')) {
            const s = document.createElement('style');
            s.id = 'calisto-font-face';
            s.textContent = `@font-face { font-family: 'Calisto'; src: url('${CalistoFont}') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }`;
            document.head.appendChild(s);
        }
    }, []);

    /* Safe-zone constants — smoothly shrink safe zones if screen is extremely short (like 720p small laptops) */
    const safeNav = isDesktop ? 'clamp(70px, 10vh, 100px)' : isTablet ? '100px' : '64px';
    const safeMascot = isDesktop ? 'clamp(100px, 16vh, 160px)' : isTablet ? '120px' : '90px';

    // Pure relative units to ensure it NEVER overflows visually and always looks uniform
    const paddingX = isDesktop ? 'min(3vw, 3vh)' : 'min(6vw, 1.5rem)';
    const paddingY = isDesktop ? 'min(3vh, 3vw)' : 'min(3vh, 1rem)';

    // Inline styles ensure CSS min()/clamp() functions are parsed flawlessly unconditionally
    const bodySizeStyle = isDesktop
        ? { fontSize: 'clamp(10px, min(1.3vw, 1.8vh), 16px)', lineHeight: 'clamp(14px, min(1.9vw, 2.6vh), 24px)' }
        : isTablet
            ? { fontSize: 'min(2vw, 2.2vh)', lineHeight: 'min(3.2vw, 3vh)' }
            : { fontSize: 'min(3vw, 1.3vh)', lineHeight: 'min(4.5vw, 1.8vh)' };

    const taglineSizeStyle = isDesktop
        ? { fontSize: 'clamp(10px, min(1.3vw, 1.8vh), 16px)' }
        : isTablet
            ? { fontSize: 'min(2vw, 2.2vh)' }
            : { fontSize: 'min(3vw, 1.4vh)' };

    return (
        <section
            id={id}
            className={clsx(
                'w-screen flex-shrink-0 flex flex-col items-center justify-center bg-transparent relative overflow-hidden',
                className
            )}
            style={{
                height: '100dvh', // Strictly lock it
                boxSizing: 'border-box',
                paddingTop: isDesktop ? `calc(${safeNav} + clamp(3vh, 3vh, 60px))` : `calc(${safeNav} + 1vh)`,
                paddingBottom: isDesktop ? `calc(${safeMascot} + clamp(3vh, 3vh, 60px))` : `calc(${safeMascot} + 1vh)`,
                paddingLeft: isDesktop ? '5vw' : '1.5rem',
                paddingRight: isDesktop ? '5vw' : '1.5rem',
            }}
        >
            <div
                className="w-full relative z-10 flex flex-col items-center justify-center mx-auto"
                style={{
                    maxWidth: isDesktop ? 'min(50vw, 800px)' : isTablet ? '70vw' : '90vw',
                    height: '100%',
                    maxHeight: isDesktop ? '1100px' : '100%',
                }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="flex flex-col items-center w-full"
                    style={{
                        height: '100%',
                        maxHeight: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    {/* Header inline (same as Portfolio/Team) */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center w-full flex-shrink-0" style={{ marginBottom: isDesktop ? 'min(2vh, 2vw)' : 'min(2vh, 1rem)' }}>
                        <h2 style={{
                            margin: 0,
                            lineHeight: 1,
                            fontWeight: 400,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            position: 'relative',
                        }}>
                            <span style={{
                                fontFamily: RETROICA,
                                fontSize: isDesktop ? 'clamp(1.5rem, min(4.5vw, 6vh), 4.5rem)' : 'clamp(1rem, min(6vw, 4vh), 2rem)',
                                letterSpacing: '-0.02em',
                                color: '#FFFFFF',
                                textTransform: 'lowercase',
                                fontWeight: 400,
                                textShadow: `
                                     0 0 8px rgba(255, 165, 0, 0.5),
                                     0 0 16px rgba(255, 165, 0, 0.35),
                                     0 0 30px rgba(255, 165, 0, 0.25),
                                     0 0 50px rgba(255, 165, 0, 0.15),
                                     0 0 70px rgba(255, 165, 0, 0.08)
                                 `,
                            }}>
                                about us
                            </span>
                            <span style={{
                                fontFamily: RETROICA,
                                fontSize: isDesktop ? 'clamp(1.5rem, min(4.5vw, 6vh), 4.5rem)' : 'clamp(1rem, min(6vw, 4vh), 2rem)',
                                color: '#FFFFFF',
                                fontWeight: 400,
                                textShadow: `
                                     0 0 8px rgba(255, 165, 0, 0.5),
                                     0 0 16px rgba(255, 165, 0, 0.35),
                                     0 0 30px rgba(255, 165, 0, 0.25),
                                     0 0 50px rgba(255, 165, 0, 0.15),
                                     0 0 70px rgba(255, 165, 0, 0.08)
                                 `,
                            }}>
                                .
                            </span>
                        </h2>

                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: isDesktop ? 'min(20vw, 35vh)' : 'min(50vw, 240px)',
                            height: '3px',
                            marginTop: 'min(1vh, 0.5rem)',
                            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 15%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.5) 85%, rgba(255, 255, 255, 0) 100%)',
                            borderRadius: '9999px',
                            boxShadow: '0 2px 8px rgba(255, 165, 0, 0.12)',
                        }} />
                    </motion.div>

                    {/* Glassmorphism card container */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full relative flex flex-col items-stretch flex-shrink-0"
                    >
                        <div
                            className="flex flex-col relative z-10 w-full max-h-full"
                            style={{
                                height: 'max-content',
                                paddingLeft: paddingX,
                                paddingRight: paddingX,
                                paddingTop: paddingY,
                                paddingBottom: paddingY,
                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.16) 100%)',
                                backdropFilter: 'blur(8px) saturate(1.2)',
                                WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
                                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                                borderRadius: isDesktop ? '32px' : isTablet ? '28px' : '22px',
                                boxShadow: '0 0 30px rgba(255, 140, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                                overflowY: 'hidden', // Strictly prevent scrollbars
                            }}
                        >
                            {/* Inner Body Text container */}
                            <div
                                className="flex flex-col text-text/90 mx-auto w-full my-auto text-justify"
                                style={{
                                    ...bodySizeStyle,
                                    fontFamily: 'var(--font-calisto, "Calisto", sans-serif)',
                                    fontWeight: 100,
                                    letterSpacing: '0.02em',
                                    WebkitFontSmoothing: 'antialiased',
                                    ...(isDesktop ? {
                                        paintOrder: 'stroke fill',
                                        WebkitTextStroke: '0.1px rgba(250, 204, 21, 0.4)',
                                    } : {}),
                                    gap: isDesktop ? 'min(2.5vh, 2vw)' : isTablet ? 'min(3vh, 1.5rem)' : 'min(2vh, 0.6rem)'
                                }}
                            >
                                <motion.p variants={itemVariants}>
                                    Aakrit Cinematic Solutions was born from a simple yet powerful thought — to contribute to India's animation and film industry and show the world its true creative strength. What began as a spark has now evolved into a mission: to build a full-spectrum production house that excels in movies, animation, VFX, 3D visualization, editing, and every craft that brings imagination to life.
                                </motion.p>

                                <motion.p variants={itemVariants}>
                                    The name Aakrit, rooted in Sanskrit, means "to create". It represents our cultural foundation and the belief that creation is the most transformative act. Staying grounded in our Sanskriti keeps us humble; our ambition pushes us to innovate, experiment, and deliver on global standards.
                                </motion.p>

                                <motion.p variants={itemVariants}>
                                    We are architects of imagination, designers of emotion, and creators of immersive experiences. Our vision is bold: To place Indian animation and production on the global map, proving that our industry is not just evolving — it is roaring with potential and brilliance.
                                </motion.p>

                                <motion.p variants={itemVariants}>
                                    At Aakrit Cinematic Solutions, every frame is creation, every project is passion, and every story is a new possibility. From the smallest detail to the final output — excellence is non-negotiable.
                                </motion.p>

                                {/* Taglines - Extra spacing to differentiate */}
                                <motion.div
                                    variants={itemVariants}
                                    className={clsx(
                                        "text-center w-full flex-shrink-0",
                                        isDesktop ? "mt-[min(2vh,1.5vw)]" : isTablet ? "mt-[min(3vh,20px)]" : "mt-[min(1vh,8px)]"
                                    )}
                                >
                                    <div
                                        className="flex flex-col text-tagline font-normal italic items-center"
                                        style={{ ...taglineSizeStyle, fontFamily: RETROICA, color: '#000000', gap: isTablet ? '0.75rem' : '0.2rem' }}
                                    >
                                        <p>This is Aakrit.</p>
                                        <p>Bringing ideas to life.</p>
                                        <p>Pure Cinematic Creation.</p>
                                    </div>
                                    <div className="h-[2px] w-full max-w-[200px] mx-auto bg-[#FEA800]/20 mt-3 md:mt-4" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
