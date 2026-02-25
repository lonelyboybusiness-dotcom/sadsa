import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import DiagonalGallery from "./DiagonalGallery";
import { supabase } from "../../lib/supabaseClient";
import useMediaQuery from "../../hooks/useMediaQuery";

interface ContactProps {
    id?: string;
    className?: string;
}

const inputClass =
    "w-full h-[30px] md:h-[52px] bg-white/50 rounded-[5px] !px-4 md:!px-6 text-[10px] md:text-sm text-text placeholder:text-muted/60 outline-none border-none backdrop-blur-sm transition-all duration-200";

const Contact = ({ id = "contact", className }: ContactProps) => {
    const [status, setStatus] = useState<"idle" | "success">("idle");
    const [lane1Images, setLane1Images] = useState<string[]>([]);
    const [lane2Images, setLane2Images] = useState<string[]>([]);
    const timeoutRef = useRef<number | null>(null);
    const isMobile = useMediaQuery("(max-width: 1023px)");

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data, error } = await supabase
                    .from('contact_images')
                    .select('image_url, lane');

                if (data && !error) {
                    // Process images to get public URLs if they are just paths or contain placeholders
                    const processedImages = data.map(item => {
                        let url = item.image_url;

                        // 1. Fix placeholder project ID if present
                        if (url.includes('YOUR_PROJECT_ID.supabase.co')) {
                            try {
                                const actualHost = new URL(import.meta.env.VITE_SUPABASE_URL).host;
                                url = url.replace('YOUR_PROJECT_ID.supabase.co', actualHost);
                            } catch (e) {
                                console.error('Invalid VITE_SUPABASE_URL for placeholder replacement');
                            }
                        }

                        // 2. Resolve relative storage paths
                        if (!url.startsWith('http')) {
                            const { data: { publicUrl } } = supabase.storage
                                .from('contact_images')
                                .getPublicUrl(url);
                            url = publicUrl;
                        }

                        return { ...item, image_url: url };
                    });

                    const l1 = processedImages.filter(item => item.lane === '1').map(item => item.image_url);
                    const l2 = processedImages.filter(item => item.lane === '2').map(item => item.image_url);

                    // Fallback: If no lanes are defined, just split the data
                    if (l1.length === 0 && l2.length === 0) {
                        const halfway = Math.ceil(processedImages.length / 2);
                        setLane1Images(processedImages.slice(0, halfway).map(item => item.image_url));
                        setLane2Images(processedImages.slice(halfway).map(item => item.image_url));
                    } else {
                        setLane1Images(l1);
                        setLane2Images(l2);
                    }
                }
            } catch (err) {
                console.error('Error fetching contact images:', err);
            }
        };
        fetchImages();
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("success");
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setStatus("idle"), 4000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <section
            id={id}
            className={clsx(
                "h-[100dvh] w-screen flex items-center justify-start bg-background flex-shrink-0 relative overflow-hidden",
                className,
            )}
        >
            {/* Glassy Background Decoration */}
            <div className="absolute top-[-10%] right-[-15%] md:right-[-20%] lg:right-[-15%] w-[140%] md:w-[120%] lg:w-[100%] h-[120%] pointer-events-none z-0 opacity-65 overflow-hidden flex items-center justify-end">
                <DiagonalGallery
                    lane1={lane1Images}
                    lane2={isMobile ? [] : lane2Images}
                    className="!w-[100%] !h-[120%]"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none z-1" />

            {/* Centered Heading */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-[18%] md:top-[18%] xl:top-[22%] left-0 w-full z-20 flex flex-col items-center justify-center px-6 md:px-10"
            >
                <h2
                    className="font-display font-bold tracking-widest leading-none text-center flex-shrink-0"
                    style={{
                        fontSize: isMobile ? "1.5rem" : "clamp(1.8rem, 5.5vw, 6rem)",
                        textShadow: '3px 3px 8px rgba(255, 100, 0, 0.5), 0 0 40px rgba(255, 140, 0, 0.7), 0 0 80px rgba(255, 140, 0, 0.35)',
                        color: '#ffffffff',
                        paddingBottom: 'clamp(0.2rem, 0.6vh, 0.8rem)',
                        letterSpacing: '0.12em',
                    }}
                >
                    get in touch.
                </h2>
                {/* Decorative accent line */}
                <div
                    className="flex-shrink-0"
                    style={{
                        width: 'clamp(160px, 35vw, 600px)',
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                        borderRadius: '9999px',
                    }}
                />
            </motion.div>

            <div className="w-full h-full max-w-[1400px] mx-auto px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-10 flex flex-col justify-center pt-[100px] md:pt-[150px]">
                <div className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[420px] lg:max-w-[550px]">

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/20 backdrop-blur-xl rounded-2xl p-2.5 md:p-8 shadow-xl"
                    >
                        <form onSubmit={handleSubmit} className="contact-form">

                            {/* Name */}
                            <div style={{ marginBottom: '24px' }}>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className={inputClass}
                                    style={{ paddingLeft: '1.25rem' }}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: '24px' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={inputClass}
                                    style={{ paddingLeft: '1.25rem' }}
                                    required
                                />
                            </div>

                            {/* Project Type */}
                            <div style={{ marginBottom: '24px' }}>
                                <input
                                    type="text"
                                    placeholder="Project Type"
                                    className={inputClass}
                                    style={{ paddingLeft: '1.25rem' }}
                                />
                            </div>

                            {/* Message */}
                            <div style={{ marginBottom: '24px' }}>
                                <textarea
                                    rows={1}
                                    placeholder="Message"
                                    className="w-full bg-white/50 rounded-[5px] !px-4 md:!px-6 !pt-[8px] md:!pt-[16px] pb-1.5 md:pb-3 text-[10px] md:text-sm text-text placeholder:text-muted/60 outline-none border-none backdrop-blur-sm transition-all duration-200 resize-none leading-relaxed min-h-[30px] md:min-h-[52px]"
                                    style={{ paddingLeft: '1.25rem' }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{ marginBottom: '32px' }}
                                className="group flex w-max items-center justify-center min-w-[120px] md:min-w-[160px] h-[36px] md:h-[52px] px-8 md:px-14 bg-white/20 backdrop-blur-xl text-text font-black uppercase tracking-[0.2em] text-[10px] md:text-[14px] rounded-full border-none outline-none hover:bg-white/30 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:scale-[1.02] shadow-lg"
                            >
                                <span>Submit</span>
                            </button>

                            {/* Contact Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '32px', paddingLeft: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '11px', fontWeight: 500, color: 'rgba(0,0,0,0.7)', lineHeight: 1.5 }}>
                                    <MapPin style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '2px' }} strokeWidth={1.5} />
                                    <span>15-2, Vishwa Niwas, Third Floor, Chandrodaya CHS, Thakkar Bappa Colony Rd, Near Swastik Park, Chembur, Mumbai, Maharashtra 400071</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 700, color: '#000' }}>
                                    <Phone style={{ width: '14px', height: '14px', flexShrink: 0 }} strokeWidth={1.5} />
                                    <span>+91 98198 86633</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 700, color: '#000' }}>
                                    <Mail style={{ width: '14px', height: '14px', flexShrink: 0 }} strokeWidth={1.5} />
                                    <span>studio@aakritcinematic.in</span>
                                </div>
                            </div>

                            {/* Success message */}
                            {status === "success" && (
                                <p className="mt-2 md:mt-4 text-accent text-[10px] md:text-xs uppercase tracking-[0.25em]">
                                    Message sent — we'll reply within 24 hours.
                                </p>
                            )}
                        </form>
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ marginTop: '32px' }}
                        className="text-muted/50 text-[10px] md:text-xs"
                    >
                        © 2026 Aakrit Cinematic Solutions. All rights reserved.
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default Contact;