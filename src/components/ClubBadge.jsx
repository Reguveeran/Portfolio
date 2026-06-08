import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { motion } from 'framer-motion';

export default function ClubBadge({ clubName, role, description, icon }) {
  const [isHovered, setIsHovered] = useState(false);

  // React Spring for physics-based bounds expansion on hover
  const expandSpring = useSpring({
    width: isHovered ? '340px' : '220px',
    height: isHovered ? '280px' : '160px',
    padding: isHovered ? '24px' : '16px',
    backgroundColor: isHovered ? 'rgba(25, 25, 45, 0.8)' : 'rgba(15, 15, 25, 0.4)',
    borderColor: isHovered ? 'rgba(168, 85, 247, 0.45)' : 'rgba(255, 255, 255, 0.05)',
    config: { mass: 1, tension: 210, friction: 18 }
  });

  const detailsSpring = useSpring({
    opacity: isHovered ? 1 : 0,
    maxHeight: isHovered ? '180px' : '0px',
    marginTop: isHovered ? '12px' : '0px',
    config: { mass: 1, tension: 250, friction: 22 }
  });

  return (
    <animated.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={expandSpring}
      className="glass rounded-3xl border flex flex-col items-center justify-center text-center overflow-hidden glow-purple select-none cursor-pointer"
    >
      {/* Floating & wobble icon element */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 6, -6, 0]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-3xl mb-2 flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400"
      >
        {icon}
      </motion.div>

      <h4 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">{clubName}</h4>
      <p className="text-xs text-cyan-400 font-extrabold uppercase tracking-widest mt-1">{role}</p>

      {/* Description detail block */}
      <animated.div style={detailsSpring} className="overflow-hidden w-full">
        {Array.isArray(description) ? (
          <ul className="text-left text-xs text-slate-400 leading-relaxed space-y-1.5 list-disc pl-4 pr-2">
            {description.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed max-w-[240px] mx-auto">
            {description}
          </p>
        )}
      </animated.div>
    </animated.div>
  );
}
