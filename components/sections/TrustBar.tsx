"use client";
// WHY "use client": This component uses Framer Motion for scroll animations, 
// which requires client-side execution in Next.js App Router.

import { motion } from 'framer-motion';
import { Marquee } from '../ui/Marquee';

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export function TrustBar() {
  const logos = ["Razorpay", "Zepto", "CRED", "Groww", "Meesho", "Slice", "Dukaan", "Khatabook"];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="max-w-6xl mx-auto px-4"
    >
      <div className="rounded-[3rem] border-2 border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <div className="py-8 text-center border-b-2 border-[var(--color-border)]">
          <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
            Used by teams building in public
          </p>
        </div>
        <Marquee items={logos} speed="40s" />
      </div>
    </motion.div>
  );
}
