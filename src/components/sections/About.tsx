import { useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useMediaQuery from '../../hooks/useMediaQuery';
import RetroicaFont from '../../assets/fonts/Retroica.ttf';
import CalistoFont from '../../assets/fonts/Calisto.ttf';

const RETROICA = '"Retroica", Georgia, serif';
const CALISTO = '"Calisto", serif';

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
    const isMobile = useMediaQuery('(max-width: 1023px)');

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

    /* Safe-zone constants — max() guarantees MINIMUM clearance from navbar/mascot
       regardless of zoom level. max(80px, 10dvh) means:
       - On tall screens: 10dvh wins (scales nicely)
       - On any screen: never less than 80px (navbar always visible) */
    const safeNav = isDesktop ? 'max(80px, 10dvh)' : isTablet ? 'max(90px, 13dvh)' : '70px';
    const safeMascot = isDesktop ? 'max(130px, 16dvh)' : isTablet ? 'max(110px, 14dvh)' : '90px';

    // All sizing is dvh-driven — no hardcoded px/rem font sizes.
    // Everything scales proportionally with the available viewport height.
    // Formula: font = N% of dvh, capped at a comfortable maximum.
    // At any zoom, dvh shrinks → font shrinks → content fits without scrolling.
    const bodyFont = 'min(1.55dvh, 13px)';
    const bodyLH = 'min(2.3dvh,  20px)';
    const taglineFont = 'min(1.35dvh, 11px)';
    const pGap = 'min(1dvh,    8px)';
    const cardPadX = 'min(2.5dvh,  20px)';
    const cardPadY = 'min(1.8dvh,  15px)';
    const titleMargin = 'min(1.2dvh,  10px)';

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
                paddingTop: safeNav,
                paddingBottom: safeMascot,
                paddingLeft: isDesktop ? '5vw' : '1.5rem',
                paddingRight: isDesktop ? '5vw' : '1.5rem',
            }}
        >
            <div
                className="w-full relative z-10 flex flex-col items-center justify-center mx-auto"
                style={{
                    // Wider container = fewer line wraps = fewer lines = fits better at short heights
                    maxWidth: isDesktop ? 'min(68vw, 950px)' : isTablet ? '82vw' : '92vw',
                    height: '100%',
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
                        // center: content sits in the middle of available space on large screens;
                        // on short screens the properly-scaled content still fits without overflow
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center w-full flex-shrink-0" style={{ marginBottom: titleMargin }}>
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
                                fontSize: isMobile ? '1.5rem' : 'clamp(1.8rem, 5.5vw, 6rem)',
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
                                fontSize: isMobile ? '1.5rem' : 'clamp(1.8rem, 5.5vw, 6rem)',
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
                                paddingLeft: cardPadX,
                                paddingRight: cardPadX,
                                paddingTop: cardPadY,
                                paddingBottom: cardPadY,
                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.16) 100%)',
                                backdropFilter: 'blur(8px) saturate(1.2)',
                                WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
                                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                                // Border radius: dvh-based so it scales proportionally
                                borderRadius: 'min(3dvh, 28px)',
                                boxShadow: '0 0 30px rgba(255, 140, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Inner Body Text container */}
                            <div
                                className="flex flex-col text-text/90 mx-auto w-full my-auto text-justify about-body-calisto"
                                style={{
                                    fontSize: bodyFont,
                                    lineHeight: bodyLH,
                                    fontFamily: CALISTO,
                                    fontWeight: 400,
                                    letterSpacing: '0.01em',
                                    WebkitFontSmoothing: 'antialiased',
                                    gap: pGap,
                                }}
                            >
                                <motion.p variants={itemVariants} style={{ fontFamily: CALISTO }}>
                                    Aakrit Cinematic Solutions was born from a simple yet powerful thought — to contribute to India's animation and film industry and show the world its true creative strength. What began as a spark has now evolved into a mission: to build a full-spectrum production house that excels in movies, animation, VFX, 3D visualization, editing, and every craft that brings imagination to life.
                                </motion.p>

                                <motion.p variants={itemVariants} style={{ fontFamily: CALISTO }}>
                                    The name Aakrit, rooted in Sanskrit, means "to create". It represents our cultural foundation and the belief that creation is the most transformative act. Staying grounded in our Sanskriti keeps us humble; our ambition pushes us to innovate, experiment, and deliver on global standards.
                                </motion.p>

                                <motion.p variants={itemVariants} style={{ fontFamily: CALISTO }}>
                                    We are architects of imagination, designers of emotion, and creators of immersive experiences. Our vision is bold: To place Indian animation and production on the global map, proving that our industry is not just evolving — it is roaring with potential and brilliance.
                                </motion.p>

                                <motion.p variants={itemVariants} style={{ fontFamily: CALISTO }}>
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
                                        style={{
                                            fontSize: taglineFont,
                                            lineHeight: bodyLH,
                                            fontFamily: RETROICA,
                                            color: '#000000',
                                            gap: pGap,
                                        }}
                                    >
                                        <p>This is Aakrit.</p>
                                        <p>Bringing ideas to life.</p>
                                        <p>Pure Cinematic Creation.</p>
                                    </div>
                                    <div style={{ height: '2px', width: '100%', maxWidth: '200px', margin: `${pGap} auto 0`, background: 'rgba(254,168,0,0.2)' }} />
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
