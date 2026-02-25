import React, { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQuery from '../../hooks/useMediaQuery';
import logo from '../../assets/Aakrit_logo_02-01.svg';

type SectionLink = {
    id: string;
    label: string;
};

interface NavbarProps {
    isVisible?: boolean;
}

const SECTION_LINKS: SectionLink[] = [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Portfolio' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'clients', label: 'Client Feedback' },
    { id: 'about', label: 'About Us' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact Us' },
];

const Navbar = ({ isVisible = true }: NavbarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSectionClick = useCallback(
        (sectionId: string) => {
            setIsMobileMenuOpen(false);

            if (location.pathname !== '/') {
                navigate('/', { state: { scrollTo: sectionId } });
                return;
            }

            window.dispatchEvent(
                new CustomEvent('navigate-section', {
                    detail: { sectionId },
                })
            );
        },
        [location.pathname, navigate]
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    aria-label="Primary"
                    className="
                    fixed top-0 left-0 right-0
                    w-screen
                    z-[10000]
                    h-16
                "
                    style={{
                        isolation: 'isolate',
                        fontFamily: 'var(--font-primary)',
                        background:
                            'linear-gradient(135deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0))',
                        backdropFilter: 'saturate(100%) blur(6px)',
                        WebkitBackdropFilter: 'saturate(100%) blur(6px)',
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: '12px',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow:
                            isDesktop || isTablet
                                ? '0 0px 0px 3px rgba(255, 255, 255, 0.65)'
                                : '0 1px 0px 3px rgba(255, 255, 255, 0.65)',
                    }}
                >
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0) 100%)',
                        }}
                    />
                    <div
                        className="relative z-[1] flex h-full w-full items-center justify-between"
                        style={{
                            paddingInline: isDesktop ? '2.5rem' : '0',
                        }}
                    >
                        <Link to="/" className="z-[101] flex shrink-0 items-center">
                            <img
                                src={logo}
                                alt="Aarkit Cinematic Solutions"
                                className="h-10 w-auto max-w-[200px] object-contain"
                                loading="eager"
                                style={{ display: 'block', width: '350px', height: '64px' }}
                            />
                        </Link>

                        {isDesktop ? (
                            <div className="flex items-center whitespace-nowrap">
                                {SECTION_LINKS.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => handleSectionClick(section.id)}
                                        className="
                                        cursor-pointer
                                        min-w-[78px]
                                        text-center
                                        text-[#1a1a1a]
                                        transition-all
                                        duration-300
                                        hover:scale-110
                                        hover:drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]
                                        focus:outline-none
                                    "
                                        style={{
                                            padding: '9px 10px',
                                            background: 'transparent',
                                            border: 'none',
                                            appearance: 'none',
                                            fontWeight: 'bold',
                                            fontSize: '13px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em',
                                            fontFamily: 'var(--font-primary)',
                                        }}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="relative z-[101]">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen((open) => !open)}
                                    className="focus:outline-none"
                                    style={{
                                        padding: '8px',
                                        background: 'transparent',
                                        border: 'none',
                                        appearance: 'none',
                                        color: '#000000',
                                    }}
                                    aria-label="Toggle menu"
                                    aria-expanded={isMobileMenuOpen}
                                >
                                    {isMobileMenuOpen ? (
                                        <X style={{ width: isTablet ? '26px' : '20px', height: isTablet ? '26px' : '20px' }} />
                                    ) : (
                                        <Menu style={{ width: isTablet ? '26px' : '20px', height: isTablet ? '26px' : '20px' }} />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isMobileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            className="absolute top-full mt-4 rounded-[32px] backdrop-blur-2xl origin-top-right"
                                            style={{
                                                right: '8px',
                                                width: '240px',
                                                maxWidth: 'calc(100vw - 20px)',
                                                padding: '28px 16px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                                backdropFilter: 'saturate(180%) blur(20px)',
                                                WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                                boxShadow:
                                                    '0 20px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                                            }}
                                        >
                                            <div className="flex flex-col">
                                                {SECTION_LINKS.map((section, index) => (
                                                    <React.Fragment key={section.id}>
                                                        <button
                                                            key={section.id}
                                                            type="button"
                                                            onClick={() => handleSectionClick(section.id)}
                                                            className="
                                                                cursor-pointer
                                                                relative
                                                                flex items-center justify-center
                                                                w-full
                                                                px-6
                                                                text-[16px] font-bold tracking-wide text-white
                                                                transition-all duration-300 ease-out
                                                                hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]
                                                                active:scale-[0.98]
                                                                focus-visible:outline-none
                                                            "
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                boxShadow: 'none',
                                                                fontFamily: 'var(--font-primary)',
                                                                height: '36px',
                                                                color: '#ffffff',
                                                            }}
                                                        >
                                                            {section.label}
                                                        </button>
                                                        {index < SECTION_LINKS.length - 1 && (
                                                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: '2px 8px' }} />
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default Navbar;
