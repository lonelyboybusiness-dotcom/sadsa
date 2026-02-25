import { motion } from "framer-motion";
import clsx from "clsx";

interface DiagonalGalleryProps {
  className?: string;
  speed?: number;
  reverse?: boolean;
  lane1?: string[];
  lane2?: string[];
}

const ScrollColumn = ({ speed = 20, reverse = false, images: baseImages = [] }: { speed?: number; reverse?: boolean; images?: string[] }) => {
  if (!baseImages || baseImages.length === 0) return null;

  // Triple items for extremely smooth infinite scroll
  const images = [...baseImages, ...baseImages, ...baseImages];
  const itemHeight = 400; // base height
  const gap = 26; // gap-[26px]
  const totalHeight = (itemHeight + gap) * baseImages.length;

  return (
    <div className="flex flex-col gap-[26px] relative">
      <motion.div
        className="flex flex-col gap-[18px] md:gap-[26px]"
        animate={{
          y: reverse ? [-totalHeight, 0] : [0, -totalHeight],
        }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] flex-shrink-0 rounded-[1.25rem] overflow-hidden shadow-2xl relative group"
          >
            <img
              src={src}
              alt={`Cinema still ${index}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const DiagonalGallery = ({ className, lane1, lane2 }: DiagonalGalleryProps) => {
  return (
    <div
      className={clsx(
        "relative w-full h-[90vh] sm:h-[100vh] lg:h-[120vh] overflow-hidden flex justify-center",
        className
      )}
    >
      <div className="flex gap-[18px] sm:gap-[22px] lg:gap-[26px] transform rotate-[18deg] sm:rotate-[20deg] lg:rotate-[25deg] scale-[1.05] sm:scale-[1.1] lg:scale-125 origin-center ml-[40%] sm:ml-[36%] lg:ml-[40%]">
        <ScrollColumn speed={160} images={lane1} />
        <ScrollColumn speed={160} images={lane2} reverse />
      </div>
    </div>
  );
};

export default DiagonalGallery;
