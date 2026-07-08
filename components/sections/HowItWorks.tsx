"use client";
// WHY "use client": This component uses Framer Motion for scroll animations, 
// which requires client-side execution in Next.js App Router.

import { motion, type Variants } from 'framer-motion';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Enter any URL",
      desc: "Paste a public website URL, no login required."
    },
    {
      num: "02",
      title: "We run 40+ checks",
      desc: "Meta, performance, content, technical SEO."
    },
    {
      num: "03",
      title: "Get your SEO score",
      desc: "Detailed report with actionable fixes."
    }
  ];

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
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-canvas)] border-2 border-[var(--color-border)] flex items-center justify-center mb-6 shadow-[0_4px_0_0_var(--color-border)]">
                <span className="text-2xl font-black font-bricolage text-[var(--color-text-primary)]">{step.num}</span>
              </div>
              <h3 className="text-2xl font-bold font-bricolage text-[var(--color-text-primary)] mb-3">
                {step.title}
              </h3>
              <p className="text-[var(--color-text-muted)] text-base">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
