import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface ImageGalleryProps {
  value: {
    images?: any[];
    gallery?: any[];
    columns?: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function ImageGallery({ value }: ImageGalleryProps) {
  const images = value.images || value.gallery || [];
  if (images.length === 0) return null;

  const columnClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-4",
    }[value.columns || 2] || "grid-cols-1 md:grid-cols-2";

  return (
    <motion.div
      className={cn("not-prose my-14 grid gap-5", columnClass)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {images.map((img: any, i: number) => (
        <motion.figure
          key={i}
          variants={itemVariants}
          className="group relative overflow-hidden rounded-2xl border border-border/40 bg-muted/30 shadow-sm transition-all hover:shadow-xl hover:border-border/80"
        >
          <div className="overflow-hidden">
            <Image
              src={urlFor(img).width(800).height(600).url()}
              alt={img.alt || "Gallery image"}
              width={800}
              height={600}
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          {img.caption && (
            <figcaption className="p-4 text-center text-caption italic text-muted-foreground/80 leading-relaxed bg-card/50 backdrop-blur-sm border-t border-border/20">
              {img.caption}
            </figcaption>
          )}
        </motion.figure>
      ))}
    </motion.div>
  );
}
