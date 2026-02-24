import { useRef } from 'react';
import { motion } from 'framer-motion';
import useMediaQuery from '../../hooks/useMediaQuery';

import vfxIcon from '../../assets/Icons For_services/VFX-01.svg';
import animationIcon from '../../assets/Icons For_services/ANIMATION-01.svg';
import modellingIcon from '../../assets/Icons For_services/3D modeling-01.svg';
import walkthroughIcon from '../../assets/Icons For_services/WALKTHROUGH-01.svg';
import packshotIcon from '../../assets/Icons For_services/Product packshot-01.svg';
import dcFilmsIcon from '../../assets/Icons For_services/Digital Films-01.svg';
import editingIcon from '../../assets/Icons For_services/Editing-01.svg';
import preVisIcon from '../../assets/Icons For_services/Pre_visuals-01.svg';
import layoutAnimIcon from '../../assets/Icons For_services/Layout_anim-01.svg';
import storyBoardingIcon from '../../assets/Icons For_services/Storyboarding-01.svg';

interface ServicesProps {
    id?: string;
    className?: string;
}

const services = [
    {
        id: 'vfx',
        title: 'VFX',
        description: 'Cinematic visual effects that bring imagination to life.',
        icon: vfxIcon,
    },
    {
        id: 'animation',
        title: 'Animation',
        subtitle: <>2D <span style={{ fontFamily: 'Special_Gothic_Expanded_One, sans-serif' }}>&</span> 3D</>,
        description: <>Fluid 2D and immersive 3D animations crafted with precision.</>,
        icon: animationIcon,
    },
    {
        id: '3d-modelling',
        title: '3D Modelling',
        description: 'Hyper-realistic 3D models for any creative or commercial need.',
        icon: modellingIcon,
    },
    {
        id: 'arch-walkthrough',
        title: 'Architectural Walkthrough',
        description: 'Stunning virtual walkthroughs of architectural designs.',
        icon: walkthroughIcon,
    },
    {
        id: 'packshot',
        title: 'Product Packshot',
        description: 'High-impact product visualisation for brands and marketing.',
        icon: packshotIcon,
    },
    {
        id: 'dc-films',
        title: <>Digital <span style={{ fontFamily: 'Special_Gothic_Expanded_One, sans-serif' }}>&</span> Corporate Films</>,
        description: 'Compelling digital and corporate film productions.',
        icon: dcFilmsIcon,
    },
    {
        id: 'editing',
        title: 'Editing',
        description: 'Precise and creative post-production editing solutions.',
        icon: editingIcon,
    },
    {
        id: 'pre-vis',
        title: 'Pre-Visualisation',
        description: 'Detailed pre-vis to plan and perfect every shot.',
        icon: preVisIcon,
    },
    {
        id: 'layout-anim',
        title: 'Layout Animation',
        description: 'Dynamic layout animations that define visual storytelling.',
        icon: layoutAnimIcon,
    },
    {
        id: 'story-boarding',
        title: 'Story Boarding',
        subtitle: 'and Concept Art',
        description: 'Expressive storyboards and bold concept art creations.',
        icon: storyBoardingIcon,
    },
];

interface ServiceItem {
    id: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    description: React.ReactNode;
    icon: string;
}

function ServiceCard({ service, isMobile, isPhone }: { service: ServiceItem; isMobile: boolean; isPhone: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isPhone) return;
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        card.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale(1.04)`;
        card.style.boxShadow = `${-dx * 8}px ${-dy * 8}px 28px rgba(255,140,0,0.10), 0 6px 22px rgba(0,0,0,0.22)`;
    };

    const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(254, 168, 0, 0.7)';
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (card) {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 255, 255, 0.35)';
    };

    return (
        <motion.div
            ref={cardRef}
            className="service-card"
            variants={{
                hidden: { opacity: 0, y: 28, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                cardHover: {},
            }}
            whileTap={isMobile ? { scale: 0.95, transition: { duration: 0.1 } } : undefined}
            whileHover={!isPhone ? 'cardHover' : undefined}
            animate={isMobile ? {
                boxShadow: [
                    "0 0 12px rgba(255, 140, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
                    "0 0 22px rgba(254, 168, 0, 0.28), 0 4px 16px rgba(0, 0, 0, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.5)",
                    "0 0 12px rgba(255, 140, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4)"
                ]
            } : undefined}
            transition={isMobile ? { repeat: Infinity, duration: 3.5, ease: "easeInOut" } : undefined}
            style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.16) 100%)',
                backdropFilter: 'blur(8px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderTop: '1.5px solid rgba(255, 255, 255, 0.5)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 'clamp(10px, 1.5vw, 18px)',
                padding: isMobile
                    ? '22px 0.7rem 0.7rem'
                    : 'clamp(0.7rem, 1.5vw, 1.4rem) clamp(0.7rem, 1.2vw, 1.2rem)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 'clamp(0.3rem, 0.6vw, 0.6rem)',
                boxShadow: '0 0 12px rgba(255, 140, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                position: 'relative',
                overflow: 'visible',
            }}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            {/* Icon — propagates cardHover from parent card on desktop/iPad, loops on phone */}
            <motion.div
                className="service-icon"
                variants={!isPhone ? {
                    visible: {
                        y: 0,
                        filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
                    },
                    cardHover: {
                        y: -10,
                        filter: "drop-shadow(0px 6px 18px rgba(254, 168, 0, 0.9)) drop-shadow(0px 0px 12px rgba(254, 168, 0, 0.55))"
                    },
                } : undefined}
                animate={isPhone ? {
                    y: [0, -8, 0],
                    filter: [
                        "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))",
                        "drop-shadow(0px 4px 14px rgba(254, 168, 0, 0.7)) drop-shadow(0px 0px 8px rgba(254, 168, 0, 0.4))",
                        "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
                    ]
                } : undefined}
                transition={
                    isPhone
                        ? { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
                        : { duration: 0.3, ease: "easeOut" }
                }
                style={{
                    position: 'absolute',
                    top: isMobile ? '-14px' : 'clamp(-30px, -4vw, -45px)',
                    left: isMobile ? '10px' : 'clamp(5px, 1vw, 15px)',
                    width: isMobile ? '28px' : 'clamp(30px, 3.5vw, 50px)',
                    height: isMobile ? '28px' : 'clamp(30px, 3.5vw, 50px)',
                    zIndex: 10,
                }}
            >
                <img src={service.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </motion.div>

            {/* Interior shine shimmer */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                }}
            />

            {/* Title */}
            <div>
                <p
                    style={{
                        color: '#000000',
                        fontFamily: 'Calisto, serif',
                        fontWeight: 700,
                        fontSize: 'clamp(0.65rem, 1.15vw, 1.1rem)',
                        lineHeight: 1.25,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                    }}
                >
                    {service.title}
                </p>
                {service.subtitle && (
                    <p
                        style={{
                            color: '#000000ff',
                            fontFamily: 'Calisto, serif',
                            fontSize: 'clamp(0.55rem, 0.95vw, 0.9rem)',
                            letterSpacing: '0.06em',
                            marginTop: '1px',
                        }}
                    >
                        {service.subtitle}
                    </p>
                )}
            </div>

            {/* Description */}
            <p
                style={{
                    color: 'rgba(0,0,0,0.65)',
                    fontFamily: 'Calisto, serif',
                    fontSize: 'clamp(0.5rem, 0.8vw, 0.82rem)',
                    lineHeight: 1.5,
                    letterSpacing: '0.02em',
                }}
            >
                {service.description}
            </p>

            {/* Bottom accent line */}
            <div
                style={{
                    marginTop: 'auto',
                    width: '30%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #FEA800, transparent)',
                    borderRadius: '9999px',
                    opacity: 0.6,
                }}
            />
        </motion.div>
    );
}


const Services = ({ id = 'services' }: ServicesProps) => {
    const isMobile = useMediaQuery('(max-width: 1023px)');
    const isPhone = useMediaQuery('(max-width: 767px)');
    const containerRef = useRef<HTMLDivElement>(null);


    return (
        <section
            id={id}
            className="h-[100dvh] w-full flex flex-col items-center justify-start bg-background flex-shrink-0 relative overflow-hidden"
            style={{ paddingTop: '4rem' }}
        >
            {/* Inner wrapper — centers content in the remaining height below navbar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'calc(100dvh - 4rem)', paddingBottom: '4vh', paddingTop: '1vh' }}>


                {/* Title */}
                <h2
                    className="font-display font-bold tracking-widest leading-none text-center flex-shrink-0"
                    style={{
                        fontSize: 'clamp(1.8rem, 5.5vw, 6rem)',
                        textShadow: '3px 3px 8px rgba(255, 100, 0, 0.5), 0 0 40px rgba(255, 140, 0, 0.7), 0 0 80px rgba(255, 140, 0, 0.35)',
                        color: '#ffffffff',
                        paddingBottom: 'clamp(0.3rem, 0.8vh, 0.8rem)',
                        letterSpacing: '0.12em',
                    }}
                >
                    our services.
                </h2>

                {/* Decorative accent line */}
                <div
                    className="flex-shrink-0"
                    style={{
                        width: 'clamp(200px, 38vw, 600px)',
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                        borderRadius: '9999px',
                        marginBottom: 'clamp(1.2rem, 3vh, 3rem)',
                    }}
                />

                {/* Cards grid */}
                <motion.div
                    ref={containerRef}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.07 } },
                    }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                        gap: 'clamp(0.75rem, 1.8vw, 2rem)',
                        width: '100%',
                        maxWidth: '1300px',
                        padding: 'clamp(1rem, 2vh, 2rem) clamp(1rem, 4vw, 4rem) clamp(1.5rem, 3vh, 3rem)',
                        flex: 'none',
                        alignContent: 'center',
                    }}
                >
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} isMobile={isMobile} isPhone={isPhone} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
