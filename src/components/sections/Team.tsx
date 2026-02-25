import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useMediaQuery from '../../hooks/useMediaQuery';
import UrviSvg from '../../assets/Team/URvi-01.svg';
import ChiragSvg from '../../assets/Team/CHIRAG-01.svg';
import ParasSvg from '../../assets/Team/PARAS-01.svg';
import RupeshSvg from '../../assets/Team/RUPESH-01.svg';
import RetroicaFont from '../../assets/fonts/Retroica.ttf';
const RETROICA = '"Retroica", Georgia, serif';

const teamMembers = [
    { id: 1, name: 'URvi SHAH', image: UrviSvg },
    { id: 2, name: 'CHIRAG K. MALI', image: ChiragSvg },
    { id: 3, name: 'PARAS SHARMA', image: ParasSvg },
    { id: 4, name: 'RUPESH GUPTA', image: RupeshSvg },
];

const Team = ({ id = 'our team' }: { id?: string }) => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const isTablet = useMediaQuery('(min-width: 600px) and (max-width: 1023px)');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [cardPointer, setCardPointer] = useState<Record<number, { x: number; y: number }>>({});

    useEffect(() => {
        // Inject Retroica font
        if (!document.getElementById('retroica-font-face')) {
            const s = document.createElement('style');
            s.id = 'retroica-font-face';
            s.textContent = `@font-face { font-family: 'Retroica'; src: url('${RetroicaFont}') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }`;
            document.head.appendChild(s);
        }
    }, []);

    /* Safe-zone constants — max() guarantees a MINIMUM clearance from navbar/mascot.
       This means padding is ALWAYS at least the navbar/mascot height regardless of zoom.
       e.g. at 125% zoom on a 500px screen: vh=400, but padding floors at 80px/130px. */
    const navPad = isDesktop ? 'max(80px, 10dvh)' : isTablet ? 'max(90px, 13dvh)' : '64px';
    const mascotPad = isDesktop ? 'max(130px, 16dvh)' : isTablet ? 'max(110px, 14dvh)' : '100px';

    // Card container maxWidth derived from exact available height formula:
    // availableCardHeight = 100dvh - navPad - mascotPad - headerArea
    // Here: navPad = max(80px,10dvh), mascotPad = max(130px,16dvh), header ≈ min(10dvh,70px)
    // cardWidth_per_card = availableCardHeight * (1080/1350) = * 0.8
    // Total 4 cards = availableCardHeight * 0.8 * 4 + 3*gap(24px) = * 3.2 + 72px

    return (
        <section
            id={id}
            style={{
                height: '100dvh',
                width: '100%',
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                paddingTop: navPad,
                paddingBottom: mascotPad,
                paddingLeft: isDesktop ? '5vw' : isTablet ? '6vw' : '7vw',
                paddingRight: isDesktop ? '5vw' : isTablet ? '6vw' : '7vw',
                flexShrink: 0,
            }}
            className="bg-background text-text"
        >
            {/* ── Header — title shrinks with vh so it never overlaps navbar ── */}
            <header style={{
                position: 'relative',
                zIndex: 20,
                // Margin shrinks on short screens so cards get more space
                marginBottom: 'min(2vh, 1.2rem)',
                width: '100%',
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
            }}>
                <h2
                    className="font-display font-bold tracking-widest leading-none text-center flex-shrink-0"
                    style={{
                        fontSize: isDesktop ? 'clamp(1.8rem, 5.5vw, 6rem)' : '1.5rem',
                        textShadow: '3px 3px 8px rgba(255, 100, 0, 0.5), 0 0 40px rgba(255, 140, 0, 0.7), 0 0 80px rgba(255, 140, 0, 0.35)',
                        color: '#ffffffff',
                        paddingBottom: 'clamp(0.2rem, 0.6vh, 0.6rem)',
                        letterSpacing: '0.12em',
                        fontFamily: RETROICA,
                    }}
                >
                    our team.
                </h2>

                {/* Glowing accent line — same as other pages */}
                <div
                    className="flex-shrink-0 mt-2"
                    style={{
                        position: 'relative',
                        width: 'clamp(280px, 60vw, 500px)',
                        height: '3px',
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 15%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.5) 85%, rgba(255, 255, 255, 0) 100%)',
                        borderRadius: '9999px',
                        boxShadow: '0 2px 8px rgba(255, 165, 0, 0.12)',
                    }}
                />
            </header>

            {/* ── Cards grid ── */}
            <div style={{
                width: '100%',
                // Exact formula: available = 100dvh - max(80,10dvh) - max(130,16dvh) - min(10dvh,70px)
                // maxWidth = available * 3.2 + 72px (3.2 = 4 cards * 0.8 aspect; 72 = 3 gaps * 24px)
                // Nested min() to also cap at viewport width and absolute max
                maxWidth: isDesktop
                    ? 'min(min(1260px, 86vw), calc((100dvh - max(80px, 10dvh) - max(130px, 16dvh) - min(10dvh, 70px)) * 3.2 + 72px))'
                    : isTablet
                        ? 'min(min(480px, 86vw), calc((100dvh - max(90px, 13dvh) - max(110px, 14dvh) - min(8dvh, 60px)) * 1.6 + 24px))'
                        : 'min(340px, 86vw)',
                position: 'relative',
                zIndex: 30,
                boxSizing: 'border-box',
                margin: '0 auto',
                flexShrink: 0,
            }}>
                <div ref={containerRef} style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'visible',
                    maxHeight: '100%',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
                        gap: isDesktop ? '1.5rem' : isTablet ? '1rem' : '0.8rem',
                        width: '100%',
                        boxSizing: 'border-box',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {teamMembers.map((member, index) => {
                            const isHovered = hoveredIndex === index;

                            return (
                                <motion.div
                                    key={`${member.name}-${index}`}
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '1080 / 1350',
                                        // Border radius scales with card — clamp prevents over-rounding on small cards
                                        borderRadius: 'clamp(6px, 1.5%, 14px)',
                                        overflow: 'visible',
                                        cursor: isDesktop ? 'pointer' : 'default',
                                        margin: '0 auto',
                                    }}
                                    onPointerMove={isDesktop ? (e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setCardPointer((prev) => ({
                                            ...prev,
                                            [index]: {
                                                x: e.clientX - rect.left,
                                                y: e.clientY - rect.top
                                            }
                                        }));
                                    } : undefined}
                                    onPointerEnter={isDesktop ? (e) => {
                                        setHoveredIndex(index);
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setCardPointer((prev) => ({
                                            ...prev,
                                            [index]: {
                                                x: e.clientX - rect.left,
                                                y: e.clientY - rect.top
                                            }
                                        }));
                                    } : undefined}
                                    onPointerLeave={isDesktop ? () => setHoveredIndex(null) : undefined}
                                    whileHover={isDesktop ? {
                                        scale: 1.05,
                                        zIndex: 50,
                                    } : {}}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                    {/* Card container */}
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 'clamp(6px, 1.5%, 14px)',
                                        overflow: 'hidden',
                                        boxShadow: isHovered
                                            ? '0 10px 40px rgba(255, 165, 0, 0.4), 0 0 60px rgba(255, 165, 0, 0.2)'
                                            : '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        transition: 'box-shadow 0.3s ease',
                                    }}>
                                        {/* SVG Image */}
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            overflow: 'hidden',
                                        }}>
                                            {/* Base grayscale image for desktop, colored for mobile/tablet */}
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    filter: isDesktop
                                                        ? 'grayscale(1) brightness(0.8)'
                                                        : 'grayscale(0) brightness(1)',
                                                    transition: 'filter 0.5s ease',
                                                }}
                                            />

                                            {/* Desktop only: Color reveal on hover with radial gradient mask */}
                                            {isDesktop && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    backgroundImage: `url(${member.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    maskImage: isHovered
                                                        ? `radial-gradient(circle 400px at ${cardPointer[index]?.x !== undefined ? cardPointer[index].x + 'px' : '50%'} ${cardPointer[index]?.y !== undefined ? cardPointer[index].y + 'px' : '50%'}, black 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`
                                                        : 'none',
                                                    WebkitMaskImage: isHovered
                                                        ? `radial-gradient(circle 400px at ${cardPointer[index]?.x !== undefined ? cardPointer[index].x + 'px' : '50%'} ${cardPointer[index]?.y !== undefined ? cardPointer[index].y + 'px' : '50%'}, black 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`
                                                        : 'none',
                                                    opacity: isHovered ? 1 : 0,
                                                    transition: 'opacity 0.4s ease-out',
                                                    pointerEvents: 'none',
                                                }} />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Team;