import { useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { ExternalLink } from 'lucide-react';

export default function ProjectCard({ title, type, desc, tech, link }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Set up spring physics configuration for weightless movements and bounce
  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 1.2, tension: 200, friction: 14 } // Bounce configs
  }));

  const dragStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const handleMouseDown = (e) => {
    // Prevent triggering link clicks during initial drag
    if (e.target.closest('a')) return;
    
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    api.start({ scale: 1.02 });
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      api.start({ x: dx, y: dy });
    } else if (isHovered && cardRef.current) {
      // 3D Tilt calculation
      const rect = cardRef.current.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const rotateY = ((mouseX / cardWidth) - 0.5) * 16;  // Range -8deg to +8deg
      const rotateX = -((mouseY / cardHeight) - 0.5) * 16; // Range -8deg to +8deg
      
      api.start({ rotateX, rotateY, scale: 1.04 });
    }
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      api.start({ x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isDraggingRef.current) {
      api.start({ rotateX: 0, rotateY: 0, scale: 1 });
    }
  };

  return (
    <animated.div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        transform: props.scale.to((s) => `perspective(1000px) rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg) scale(${s})`),
        x: props.x,
        y: props.y,
        touchAction: 'none'
      }}
      className={`glass-card p-6 rounded-2xl glow-blue relative select-none w-full flex flex-col justify-between min-h-[220px] active:cursor-grabbing ${isDraggingRef.current ? 'cursor-grabbing border-blue-500/50' : 'cursor-grab'}`}
    >
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h3>
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
        {type && (
          <div className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider mb-3">
            {type}
          </div>
        )}
        
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {desc}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tech.map((t, idx) => (
          <span 
            key={idx} 
            className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/15"
          >
            {t}
          </span>
        ))}
      </div>
    </animated.div>
  );
}
