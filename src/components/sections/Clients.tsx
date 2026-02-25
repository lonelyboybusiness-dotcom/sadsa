import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import InteractiveVideo from "../ui/InteractiveVideo";
import useMediaQuery from "../../hooks/useMediaQuery";
interface ClientsProps {
    id?: string;
    className?: string;
}

const Clients = ({ id = "clients", className }: ClientsProps) => {
    const isMobile = useMediaQuery('(max-width: 1023px)');
    const [fetchedLogos, setFetchedLogos] = useState<{ src: string; alt: string }[]>([]);
    const [fetchedVideos, setFetchedVideos] = useState<{ id: number; youtubeId: string; title: string }[]>([]);

    useEffect(() => {
        const fetchLogos = async () => {
            const { data, error } = await supabase
                .from("logos")
                .select("client_name, logo_url")
                .order("id", { ascending: true });

            if (error) {
                console.error("Error fetching logos:", error);
            } else if (data && data.length > 0) {
                const mappedLogos = data
                    .filter(item => item.logo_url) // ensure url exists
                    .map(item => ({
                        src: item.logo_url as string,
                        alt: item.client_name
                    }));
                if (mappedLogos.length > 0) {
                    setFetchedLogos(mappedLogos);
                }
            }
        };

        const fetchVideos = async () => {
            const { data, error } = await supabase
                .from("videos")
                .select("id, youtube_id, title")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching videos:", error);
            } else if (data && data.length > 0) {
                const mappedVideos = data
                    .filter(item => item.youtube_id)
                    .map(item => ({
                        id: item.id,
                        youtubeId: item.youtube_id,
                        title: item.title || "Client Feedback"
                    }));
                setFetchedVideos(mappedVideos);
            }
        };

        fetchLogos();
        fetchVideos();
    }, []);

    const displayLogos = fetchedLogos;

    return (
        <section
            id={id}
            className={clsx(
                "relative w-full min-h-screen bg-primary flex flex-col items-center justify-center py-[48px] md:py-[72px] lg:py-[88px]",
                className
            )}
        >
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .logo-animate {
                    animation: marquee 30s linear infinite;
                }
                .home-logo-wrapper {
                    display: flex;
                    overflow: hidden;
                    width: 100%;
                }
                .clients-grid {
                    display: flex;
                    flex-shrink: 0;
                    align-items: center;
                    gap: 6rem;
                    padding-right: 6rem;
                }
                .client-logo {
                    height: 2rem; 
                    width: auto;
                    max-width: 150px;
                    object-fit: contain;
                    flex-shrink: 0;
                }

                .desktop-video-row { display: none; }

                /* ── MOBILE + TABLET GRID (< 1280px) ── */
                .mobile-video-grid { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; padding: 0 0.5rem 1rem 0.5rem; }
                .mobile-top-row { display: flex; flex-direction: row; gap: 0.5rem; width: 100%; }
                .mobile-top-row .mobile-video-card { flex: 1; aspect-ratio: 16/10; position: relative; }
                .mobile-bottom-row { display: flex; justify-content: center; width: 100%; }
                .mobile-bottom-row .mobile-video-card { width: 55%; aspect-ratio: 16/10; position: relative; }

                /* ── TABLET (768px–1279px) ── */
                @media (min-width: 768px) and (max-width: 1279px) {
                    .desktop-video-row { display: none !important; }
                    .mobile-video-grid { display: flex !important; padding: 0 2rem 3rem 2rem; gap: 1.2rem; }
                    .mobile-top-row { gap: 1.2rem; }
                    .mobile-bottom-row .mobile-video-card { width: 45%; }
                    .client-logo { height: 2rem; }
                }

                /* ── DESKTOP (1280px+) ── */
                @media (min-width: 1280px) {
                    .desktop-video-row { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 2rem; width: 100%; overflow-x: auto; padding: 0 0 48px 0; scrollbar-width: none; overflow-y: visible; }
                    .desktop-video-row::-webkit-scrollbar { display: none; }
                    .mobile-video-grid { display: none !important; }
                    .client-logo { height: 2.5rem; }
                    .clients-grid { gap: 4rem; padding-right: 4rem; } 
                }
            `}</style>

            {/* Background glow */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00ff8899,transparent_50%)]" />
            </div>

            {/* Heading + Videos */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 mb-10">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="inline-flex flex-col items-center justify-center mb-[clamp(1.2rem,3vh,3rem)]">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-display font-bold tracking-widest leading-none text-center flex-shrink-0"
                            style={{
                                fontSize: isMobile ? '1.5rem' : 'clamp(1.8rem, 5.5vw, 6rem)',
                                textShadow: '3px 3px 8px rgba(255, 100, 0, 0.5), 0 0 40px rgba(255, 140, 0, 0.7), 0 0 80px rgba(255, 140, 0, 0.35)',
                                color: '#ffffffff',
                                paddingBottom: isMobile ? '0.2rem' : 'clamp(0.3rem, 0.8vh, 0.8rem)',
                                letterSpacing: '0.12em',
                            }}
                        >
                            client feedback.
                        </motion.h2>

                        {/* Decorative accent line */}
                        <div
                            className="flex-shrink-0"
                            style={{
                                width: isMobile ? '140px' : 'clamp(200px, 38vw, 600px)',
                                height: '3px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                borderRadius: '9999px',
                            }}
                        />
                    </div>

                    {/* DESKTOP VIDEOS */}
                    <div className="desktop-video-row">
                        {fetchedVideos.map((video) => (
                            <div
                                key={`desktop-${video.id}`}
                                className="group relative"
                                style={{
                                    flexShrink: 0,
                                    width: "360px",
                                    aspectRatio: "16/10",
                                    position: "relative"
                                }}
                            >
                                {/* 1. OUTER AMBIENT GLOW */}
                                <div className="absolute inset-x-10 -bottom-4 h-1/2 bg-black/20 blur-3xl -z-10" />

                                {/* THE SCREEN AREA styled like portfolio-card */}
                                <div className={clsx(
                                    "relative h-full w-full overflow-hidden rounded-[1.15rem] bg-[rgba(255,255,255,0.05)]",
                                    "border-[0.125rem] border-[rgba(255,255,255,0.9)]",
                                    "shadow-[0_0.375rem_0.9rem_rgba(0,0,0,0.14),0_0_0.35rem_rgba(255,255,255,0.22),0_0_1rem_rgba(255,255,255,0.18)]",
                                    "transition-all duration-200 ease-in-out",
                                    "hover:-translate-y-[0.1rem] hover:border-[#ffffff] hover:shadow-[0_0.625rem_2.5rem_rgba(255,165,0,0.4),0_0_3.75rem_rgba(255,165,0,0.2)]"
                                )}>

                                    {/* Inner subtle glow and reflection details like portfolio-card::before and ::after */}
                                    <div className="absolute inset-0 rounded-inherit pointer-events-none z-10 border-[0.09rem] border-[rgba(255,255,255,0.66)] shadow-[inset_0_0_0.18rem_rgba(255,255,255,0.48),inset_0_0_1rem_rgba(255,255,255,0.14),0_0_1.05rem_rgba(255,255,255,0.24)]" />

                                    <div className="absolute inset-0 rounded-inherit pointer-events-none z-10 opacity-80" style={{
                                        background: `linear-gradient(150deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.12) 18%, rgba(255, 255, 255, 0.02) 36%, rgba(255, 255, 255, 0) 58%), radial-gradient(120% 85% at 50% -18%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 62%), radial-gradient(110% 92% at 50% 118%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 68%)`
                                    }} />

                                    <InteractiveVideo className="relative z-0">
                                        <iframe
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                            src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0&controls=1`}
                                            title={video.title}
                                            allowFullScreen
                                        />
                                    </InteractiveVideo>
                                </div>

                                {/* 4. REFINED DATA TAG */}
                                <div className="mt-8 flex items-center justify-between px-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                                        <p className="text-black text-[11px] font-black uppercase tracking-[0.3em]"></p>
                                    </div>
                                    <p className="text-black/40 text-[9px] font-mono font-medium"></p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* MOBILE + TABLET VIDEOS: 2 on top, 1 centered below */}
                    <div className="mobile-video-grid">
                        <div className="mobile-top-row">
                            {fetchedVideos.slice(0, 2).map((video) => (
                                <div key={`mob-top-${video.id}`} className="mobile-video-card">
                                    <div className="absolute inset-x-10 -bottom-4 h-1/2 bg-black/20 blur-3xl -z-10" />
                                    {/* THE SCREEN AREA */}
                                    <div className={clsx(
                                        "relative h-full w-full overflow-hidden rounded-[1.15rem] bg-[rgba(255,255,255,0.05)]",
                                        "border-[0.125rem] border-[rgba(255,255,255,0.9)]",
                                        "shadow-[0_0.375rem_0.9rem_rgba(0,0,0,0.14),0_0_0.35rem_rgba(255,255,255,0.22),0_0_1rem_rgba(255,255,255,0.18)]",
                                        "transition-all duration-200 ease-in-out",
                                        "hover:-translate-y-[0.1rem] hover:border-[#ffffff] hover:shadow-[0_0.625rem_2.5rem_rgba(255,165,0,0.4),0_0_3.75rem_rgba(255,165,0,0.2)]"
                                    )}>
                                        {/* Inner subtle glow and reflection details */}
                                        <div className="absolute inset-0 rounded-inherit pointer-events-none z-10 border-[0.09rem] border-[rgba(255,255,255,0.66)] shadow-[inset_0_0_0.18rem_rgba(255,255,255,0.48),inset_0_0_1rem_rgba(255,255,255,0.14),0_0_1.05rem_rgba(255,255,255,0.24)]" />

                                        <div className="absolute inset-0 rounded-inherit pointer-events-none z-10 opacity-80" style={{
                                            background: `linear-gradient(150deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.12) 18%, rgba(255, 255, 255, 0.02) 36%, rgba(255, 255, 255, 0) 58%), radial-gradient(120% 85% at 50% -18%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 62%), radial-gradient(110% 92% at 50% 118%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 68%)`
                                        }} />
                                        <InteractiveVideo className="relative z-0">
                                            <iframe
                                                style={{ width: "100%", height: "100%", border: "none" }}
                                                src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0&controls=1`}
                                                title={video.title}
                                                allowFullScreen
                                            />
                                        </InteractiveVideo>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {fetchedVideos[2] && (
                            <div className="mobile-bottom-row">
                                <div className="mobile-video-card">
                                    <div className="absolute inset-x-10 -bottom-4 h-1/2 bg-black/20 blur-3xl -z-10" />
                                    {/* THE SCREEN AREA */}
                                    <div className={clsx(
                                        "relative h-full w-full overflow-hidden rounded-[1.15rem] bg-[rgba(255,255,255,0.05)]",
                                        "border-[0.125rem] border-[rgba(255,255,255,0.9)]",
                                        "shadow-[0_0.375rem_0.9rem_rgba(0,0,0,0.14),0_0_0.35rem_rgba(255,255,255,0.22),0_0_1rem_rgba(255,255,255,0.18)]",
                                        "transition-all duration-200 ease-in-out",
                                        "hover:-translate-y-[0.1rem] hover:border-[#ffffff] hover:shadow-[0_0.625rem_2.5rem_rgba(255,165,0,0.4),0_0_3.75rem_rgba(255,165,0,0.2)]"
                                    )}>
                                        <div className="absolute inset-0 rounded-inherit pointer-events-none z-10 border-[0.09rem] border-[rgba(255,255,255,0.66)] shadow-[inset_0_0_0.18rem_rgba(255,255,255,0.48),inset_0_0_1rem_rgba(255,255,255,0.14),0_0_1.05rem_rgba(255,255,255,0.24)]" />

                                        <div className="absolute inset-0 rounded-inherit pointer-events-none z-10 opacity-80" style={{
                                            background: `linear-gradient(150deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.12) 18%, rgba(255, 255, 255, 0.02) 36%, rgba(255, 255, 255, 0) 58%), radial-gradient(120% 85% at 50% -18%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 62%), radial-gradient(110% 92% at 50% 118%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 68%)`
                                        }} />
                                        <InteractiveVideo className="relative z-0">
                                            <iframe
                                                style={{ width: "100%", height: "100%", border: "none" }}
                                                src={`https://www.youtube.com/embed/${fetchedVideos[2].youtubeId}?modestbranding=1&rel=0&controls=1`}
                                                title={fetchedVideos[2].title}
                                                allowFullScreen
                                            />
                                        </InteractiveVideo>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── ORANGE PILL LOGO SCROLLER ── */}
            <div className="relative z-10 w-full mt-8 md:mt-12 bg-black py-10 md:py-16">
                <div className="px-[5vw] mb-6 md:mb-8 text-center flex justify-center">
                    <h3 className="text-white/20 text-lg md:text-3xl font-bold tracking-tighter uppercase italic leading-none text-center">
                        WE WORKED WITH
                    </h3>
                </div>

                {/* Orange Pill Container */}
                <div className="mx-auto w-[90%] md:w-[75%] lg:w-[60%] mt-[2vh] md:mt-[4vh] max-w-5xl">
                    <div className="relative h-[60px] md:h-[80px] bg-[#f59e0b] px-6 md:px-12 rounded-[30px] md:rounded-full flex items-center overflow-hidden drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] shadow-[0_15px_40px_rgba(0,0,0,0.3)] border-4 border-[#f59e0b]">
                        <div className="home-logo-wrapper">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div key={`grid-${i}`} className="clients-grid logo-animate" aria-hidden={i > 0}>
                                    {displayLogos.map((logo, index) => (
                                        <img key={`${i}-${index}`} src={logo.src} alt={logo.alt} className="client-logo" loading="eager" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Clients;