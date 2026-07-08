"use client";
// WHY "use client": This component uses the animated Gauge component and Framer Motion 
// for scroll animations, which both require client-side execution in Next.js App Router.

import { motion, type Variants } from 'framer-motion';
import { Gauge } from '../ui/Gauge';
import { ScoreCard } from '../ui/ScoreCard';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export function ScorePreview() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="max-w-6xl mx-auto px-4"
    >
      <div className="rounded-[3rem] border-2 border-[var(--color-border)] bg-[var(--color-card)] px-8 py-12 md:px-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-8 right-10 hidden md:block">
          <span className="font-caveat text-xl text-[var(--color-text-muted)] rotate-[10deg] inline-block">
            * Example report
          </span>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-bricolage text-[var(--color-text-primary)] mb-4">
            Your SEO CIBIL Score
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
            One number that captures your full SEO health.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <Gauge score={74} size={280} animated={true} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <ScoreCard label="Technical" score={78} />
          <ScoreCard label="On-Page" score={85} />
          <ScoreCard label="Performance" score={62} />
          <ScoreCard label="Content" score={70} />
        </div>
      </div>
    </motion.div>
  );
}
