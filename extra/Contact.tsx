import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import DiagonalGallery from "./DiagonalGallery";
import { supabase } from "../../lib/supabaseClient";

interface ContactProps {
  id?: string;
  className?: string;
}

const Contact = ({ id = "contact", className }: ContactProps) => {
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "submitting"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [lane1Images, setLane1Images] = useState<string[]>([]);
  const [lane2Images, setLane2Images] = useState<string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from("contact_images")
          .select("image_url, lane");

        if (data && !error) {
          const processedImages = data.map((item) => {
            let url = item.image_url;

            if (url.includes("YOUR_PROJECT_ID.supabase.co")) {
              try {
                const actualHost = new URL(import.meta.env.VITE_SUPABASE_URL)
                  .host;
                url = url.replace("YOUR_PROJECT_ID.supabase.co", actualHost);
              } catch (e) {
                console.error(
                  "Invalid VITE_SUPABASE_URL for placeholder replacement",
                );
              }
            }

            if (!url.startsWith("http")) {
              const {
                data: { publicUrl },
              } = supabase.storage.from("contact_images").getPublicUrl(url);
              url = publicUrl;
            }

            return { ...item, image_url: url };
          });

          const l1 = processedImages
            .filter((item) => item.lane === "1")
            .map((item) => item.image_url);
          const l2 = processedImages
            .filter((item) => item.lane === "2")
            .map((item) => item.image_url);

          if (l1.length === 0 && l2.length === 0) {
            const halfway = Math.ceil(processedImages.length / 2);
            setLane1Images(
              processedImages.slice(0, halfway).map((item) => item.image_url),
            );
            setLane2Images(
              processedImages.slice(halfway).map((item) => item.image_url),
            );
          } else {
            setLane1Images(l1);
            setLane2Images(l2);
          }
        }
      } catch (err) {
        console.error("Error fetching contact images:", err);
      }
    };
    fetchImages();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      const { error } = await supabase.from("contact_form").insert([
        {
          name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      setStatus("success");
      setFormData({ name: "", email: "", projectType: "", message: "" });

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setStatus("error");
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setStatus("idle");
      }, 6000);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        "min-h-auto w-screen bg-background flex-shrink-0 relative overflow-hidden flex flex-col py-[2em]",
        className,
      )}
    >
      {/* Gallery behind content (phone only — full bleed background) */}
      <div
        className="pointer-events-none z-0 opacity-60 md:hidden"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "0",
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <DiagonalGallery
          lane1={lane1Images}
          lane2={lane2Images}
          className="!h-full !w-full"
        />
      </div>

      {/* Radial gradient overlay for phone */}
      <div className="absolute inset-0 md:hidden bg-radial-fade-from-center pointer-events-none z-[5]" />

         <motion.h1
  initial={{ opacity: 0, y: -20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{
    color: "white",
    textShadow: "0 0 10px orange, 0 0 20px orange, 0 0 40px orange"
  }}
  className="z-[90000000000] pt-[2em] text-center text-[2.5em] md:text-[3em] lg:text-[4em] font-[900] tracking-[-0.05em] leading-tight lowercase"
>
  get in touch.
</motion.h1>
      {/* ── Single column layout (left side only) ── */}
      <div className="relative z-10 flex w-full">

        {/* LEFT COLUMN: heading + form + info card */}
        <div className="flex flex-col w-full max-w-[700px] px-[8%] md:px-[5%] gap-[1.25em] md:gap-[1.5em]">

          {/* Heading */}


          {/* Form */}
          <motion.form
            id="contactForm"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-[0.625em] w-full"
          >
            <div className="flex flex-col gap-[0.625em] md:gap-[0.75em]">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="
                  w-full bg-white
                  border border-[rgba(255,255,255,0.5)] rounded-[0.5em]
                  px-[1.25em] h-[2.5em] md:h-[2.75em]
                  text-[#333] placeholder:text-[#333]/40
                  focus:outline-none focus:bg-white
                  focus:border-[rgba(255,180,0,0.55)]
                  focus:shadow-[0_0_1.2em_rgba(255,180,0,0.28)]
                  transition-all duration-300 text-[0.875em] md:text-[1em]
                  font-['Calisto_MT','Georgia',serif]
                "
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="
                  w-full bg-white
                  border border-[rgba(255,255,255,0.5)] rounded-[0.5em]
                  px-[1.25em] h-[2.5em] md:h-[2.75em]
                  text-[#333] placeholder:text-[#333]/40
                  focus:outline-none focus:bg-white
                  focus:border-[rgba(255,180,0,0.55)]
                  focus:shadow-[0_0_1.2em_rgba(255,180,0,0.28)]
                  transition-all duration-300 text-[0.875em] md:text-[1em]
                  font-['Calisto_MT','Georgia',serif]
                "
              />

              <input
                type="text"
                name="projectType"
                placeholder="Project Type"
                value={formData.projectType}
                onChange={handleInputChange}
                className="
                  w-full bg-white
                  border border-[rgba(255,255,255,0.5)] rounded-[0.5em]
                  px-[1.25em] h-[2.5em] md:h-[2.75em]
                  text-[#333] placeholder:text-[#333]/40
                  focus:outline-none focus:bg-white
                  focus:border-[rgba(255,180,0,0.55)]
                  focus:shadow-[0_0_1.2em_rgba(255,180,0,0.28)]
                  transition-all duration-300 text-[0.875em] md:text-[1em]
                  font-['Calisto_MT','Georgia',serif]
                "
              />

              <textarea
                name="message"
                placeholder="Message"
                rows={3}
                required
                value={formData.message}
                onChange={handleInputChange}
                className="
                  w-full bg-white
                  border border-[rgba(255,255,255,0.5)] rounded-[0.5em]
                  px-[1.25em] py-[0.5em] md:py-[0.75em]
                  text-[#333] placeholder:text-[#333]/40
                  focus:outline-none focus:bg-white
                  focus:border-[rgba(255,180,0,0.55)]
                  focus:shadow-[0_0_1.2em_rgba(255,180,0,0.28)]
                  transition-all duration-300 text-[0.875em] md:text-[1em]
                  resize-none min-h-[4em] md:min-h-[5em]
                  font-['Calisto_MT','Georgia',serif]
                "
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={status === "submitting"}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,190,0,0.22)",
                boxShadow: "0 0.8em 1.8em rgba(255,170,0,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "7em",
                height: "2.5em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                backdropFilter: "blur(2.2em)",
                WebkitBackdropFilter: "blur(2.2em)",
                border: "1px solid rgba(255,255,255,0.6)",
                color: "#000000",
                fontWeight: "700",
                fontSize: "0.75em",
                borderRadius: "0.5em",
                textTransform: "uppercase",
                letterSpacing: "0.075em",
                boxShadow: "0 0.8em 2em rgba(255,255,255,0.4)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
            >
              {status === "submitting" ? "Submitting..." : "Submit"}
            </motion.button>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#FFB400] font-medium flex items-center gap-2 text-sm"
              >
                <span className="w-2 h-2 bg-[#FFB400] rounded-full animate-pulse" />
                Thank you! We'll get back to you soon.
              </motion.p>
            )}

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 font-medium text-sm"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </motion.form>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="w-full"
            style={{
              position: "relative",
              zIndex: 10,
              isolation: "isolate",
              display: "flex",
              flexDirection: "column",
              gap: "1em",
              padding: "1.25em 1.5em",
              width: "100%",
              borderRadius: "0.5em",
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(2.5em) saturate(135%)",
              WebkitBackdropFilter: "blur(2.5em) saturate(135%)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow:
                "0 0.9em 2.2em -1em rgba(0,0,0,0.22), inset 0 0.08em 0 rgba(255,255,255,0.55)",
              overflow: "hidden",
              color: "#000",
              fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            }}
          >
            {/* glass shimmer layers */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                borderRadius: "inherit",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.05) 60%)",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.8), transparent 60%, rgba(255,255,255,0.3))",
                opacity: 0.6,
              }}
            />

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "1em" }}>
              {/* Call */}
              <div>
                <div style={{ fontSize: "0.65em", letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, opacity: 0.6, marginBottom: "0.2em" }}>
                  Call Us
                </div>
                <div style={{ fontSize: "0.875em", fontWeight: 600, letterSpacing: "0.08em" }}>
                  98198&nbsp;86633
                </div>
              </div>

              {/* Email */}
              <div className="email-link">
                <div style={{ fontSize: "0.65em", letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, opacity: 0.6, marginBottom: "0.2em" }}>
                  Email Us
                </div>
                <a
                  href="mailto:studio@aakritcinematic.in"
                  style={{ fontSize: "0.875em", fontWeight: 600, color: "#000", textDecoration: "none", position: "relative" }}
                >
                  studio@aakritcinematic.in
                </a>
              </div>

              {/* Address */}
              <div>
                <div style={{ fontSize: "0.65em", letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, opacity: 0.6, marginBottom: "0.2em" }}>
                  Visit Us
                </div>
                <p style={{ fontSize: "0.875em", fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                  15-2, Vishwa Niwas, Third Floor, Chandrodaya CHS, Thakkar
                  Bappa Colony Rd, Near Swastik Park, Chembur, Mumbai,
                  Maharashtra 400071
                </p>
              </div>
            </div>

            <style>
              {`
        .email-link a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -0.15em;
          height: 0.08em;
          width: 0;
          background: #000;
          transition: width 0.3s ease;
        }
        .email-link a:hover::after {
          width: 100%;
        }
      `}
            </style>
          </motion.div>

        </div>
          {/* Footer */}
        </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-[20px]
              text-black text-[0.5625em] md:text-[0.6875em]
              uppercase tracking-[0.35em] whitespace-nowrap font-extrabold
              self-center md:self-start
              px-[1.2em] py-[0.6em]
              bg-[rgba(255,255,255,0.35)] backdrop-blur-[1.2em]
              rounded-full shadow-[0_0.4em_1.2em_rgba(0,0,0,0.18)]
            "
          >
            © 2025 AAKRIT CINEMATIC SOLUTIONS. ALL RIGHTS RESERVED.
          </motion.p>

    </section>
  );
};

export default Contact;
