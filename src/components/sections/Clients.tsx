import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
interface ClientsProps {
    id?: string;
    className?: string;
}

const Clients = ({ id = "clients", className }: ClientsProps) => {
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
                "relative w-full min-h-screen bg-primary flex flex-col items-center justify-center py-[72px] lg:py-[88px]",
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
                    gap: 10rem;
                    padding-right: 10rem;
                }
                .client-logo {
                    height: 2.8rem; 
                    width: auto;
                    max-width: 180px;
                    object-fit: contain;
                    flex-shrink: 0;
                    /* Filter removed to keep original colors */
                }

                .desktop-video-row { display: none; }
                .mobile-video-grid { display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; padding: 0 1rem 1.5rem 1rem; }

                @media (min-width: 768px) {
                    .desktop-video-row { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 3rem; width: 100%; overflow-x: auto; padding: 0 0 72px 0; scrollbar-width: none; overflow-y: visible; }
                    .desktop-video-row::-webkit-scrollbar { display: none; }
                    .mobile-video-grid { display: none !important; }
                    .client-logo { height: 3.5rem; }
                }
            `}</style>

            {/* Background glow */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00ff8899,transparent_50%)]" />
            </div>

            {/* Heading + Videos */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 mb-10">
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex flex-col items-stretch mb-[clamp(1.2rem,3vh,3rem)]">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-display font-bold tracking-widest leading-none text-center flex-shrink-0"
                            style={{
                                fontSize: 'clamp(1.8rem, 5.5vw, 6rem)',
                                textShadow: '3px 3px 8px rgba(255, 100, 0, 0.5), 0 0 40px rgba(255, 140, 0, 0.7), 0 0 80px rgba(255, 140, 0, 0.35)',
                                color: '#ffffffff',
                                paddingBottom: 'clamp(0.3rem, 0.8vh, 0.8rem)',
                                letterSpacing: '0.12em',
                            }}
                        >
                            client feedback.
                        </motion.h2>

                        {/* Decorative accent line */}
                        <div
                            className="flex-shrink-0"
                            style={{
                                width: '100%',
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
                                style={{
                                    flexShrink: 0,
                                    width: "440px",
                                    aspectRatio: "16/10",
                                    position: "relative"
                                }}
                            >
                                {/* 1. OUTER AMBIENT GLOW (Subtle interaction with yellow BG) */}
                                <div className="absolute inset-x-10 -bottom-4 h-1/2 bg-black/20 blur-3xl -z-10" />

                                {/* 2. MAIN DEVICE FRAME */}
                                <div className={clsx(
                                    "h-full w-full bg-[#141414] overflow-hidden",
                                    "rounded-[2rem] p-[8px]", // Thinner, more precise bezel
                                    "shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]", // Multi-layer shadow + rim light
                                )}>

                                    {/* 3. THE SCREEN AREA */}
                                    <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-black group">

                                        {/* Professional Lens Reflection (Static) */}
                                        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

                                        {/* Subtle Internal Bezel Shadow */}
                                        <div className="absolute inset-0 z-10 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] pointer-events-none" />

                                        <iframe
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                            src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0&controls=1`}
                                            title={video.title}
                                            allowFullScreen
                                        />
                                    </div>
                                </div>

                                {/* 4. REFINED DATA TAG */}
                                <div className="mt-8 flex items-center justify-between px-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" /> {/* "Live" status dot */}
                                        <p className="text-black text-[11px] font-black uppercase tracking-[0.3em]">

                                        </p>
                                    </div>
                                    <p className="text-black/40 text-[9px] font-mono font-medium"></p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* MOBILE VIDEOS */}
                    <div className="mobile-video-grid flex flex-col gap-4 w-full">
                        {fetchedVideos.map((video) => (
                            <div key={`mob-${video.id}`} style={{ position: "relative", aspectRatio: "16/9", width: "100%" }}>
                                <div style={{ position: "relative", height: "100%", width: "100%", backgroundColor: "black", borderRadius: "1rem", overflow: "hidden", border: "4px solid #0a0a0a" }}>
                                    <iframe style={{ width: "100%", height: "100%" }} src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0`} title={video.title} allowFullScreen />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── ORANGE PILL LOGO SCROLLER ── */}
            <div className="relative z-10 w-full mt-12 bg-black py-16">
                <div className="px-[5vw] mb-8 text-center md:text-left">
                    <h3 className="text-white/20 text-3xl md:text-5xl font-bold tracking-tighter uppercase italic leading-none">
                        WE WORKED WITH
                    </h3>
                </div>

                {/* Orange Pill Container */}
                <div className="mx-auto w-[72%] mt-[4vh]  max-w-6xl">
                    <div className="relative h-[80px] md:h-[110px] bg-[#f59e0b] px-12 rounded-[50px] md:rounded-full flex items-center overflow-hidden drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] shadow-[0_15px_40px_rgba(0,0,0,0.3)] border-4 border-[#f59e0b]">
                        <div className="home-logo-wrapper">
                            {/* Duplicate grids ensure there are no empty gaps when looping */}
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
