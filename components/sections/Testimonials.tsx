"use client";
// WHY "use client": This component uses Framer Motion for scroll animations, 
// which requires client-side execution in Next.js App Router.

import { motion, type Variants } from 'framer-motion';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Testimonials() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="max-w-6xl mx-auto px-4"
    >
      <div className="rounded-[3rem] border-2 border-[var(--color-border)] bg-[var(--color-card)] px-8 py-12 md:px-16 md:py-20">
        <h2 className="text-4xl md:text-5xl font-black font-bricolage text-center text-[var(--color-text-primary)] mb-16">
          What Builders Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          
          <div className="rounded-[2rem] border-2 border-[var(--color-border)] bg-[var(--color-canvas)] p-8 md:p-10 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <p className="text-xl md:text-2xl font-medium text-[var(--color-text-primary)] mb-8 leading-relaxed">
              &ldquo;Fixed our title tags in 10 minutes. The breakdown was so clear we could assign tickets immediately.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-border)] flex items-center justify-center shrink-0">
                <span className="text-white font-bold font-bricolage text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[var(--color-text-primary)]">Arjun M.</span>
                <span className="text-sm text-[var(--color-text-muted)]">@arjun_codes · Startup CTO</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border-2 border-[var(--color-border)] bg-[var(--color-canvas)] p-8 md:p-10 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <p className="text-xl md:text-2xl font-medium text-[var(--color-text-primary)] mb-8 leading-relaxed">
              &ldquo;Finally understand why we rank low. The performance metrics completely exposed our massive unoptimized images.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-warn)] border-2 border-[var(--color-border)] flex items-center justify-center shrink-0">
                <span className="text-white font-bold font-bricolage text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[var(--color-text-primary)]">Sarah K.</span>
                <span className="text-sm text-[var(--color-text-muted)]">@sarahbuilds · Indie Hacker</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
