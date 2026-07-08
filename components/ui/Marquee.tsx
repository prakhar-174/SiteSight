interface MarqueeProps {
  items: string[];
  speed?: string;
}

export function Marquee({ items, speed = "30s" }: MarqueeProps) {
  return (
    <div className="flex overflow-hidden border-y-2 border-[var(--color-border)] bg-[var(--color-accent)] text-white py-6 whitespace-nowrap">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee ${speed} linear infinite;
        }
      `}</style>
      
      {/* 
        Two identical containers translating -100%. 
        This perfectly loops a continuous seamless marquee. 
      */}
      <div className="animate-marquee flex items-center min-w-full flex-shrink-0">
        {items.map((item, index) => (
          <span key={`first-${index}`} className="mx-8 text-xl md:text-2xl font-black font-bricolage tracking-widest uppercase shrink-0">
            {item}
          </span>
        ))}
      </div>
      <div className="animate-marquee flex items-center min-w-full flex-shrink-0" aria-hidden="true">
        {items.map((item, index) => (
          <span key={`second-${index}`} className="mx-8 text-xl md:text-2xl font-black font-bricolage tracking-widest uppercase shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
