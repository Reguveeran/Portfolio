import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function HeroCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile screens to limit particle counts
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matter.js Module aliases
    const { Engine, World, Bodies, Body, Vector } = Matter;

    // Create physics engine (disable default gravity since we want upward drift)
    const engine = Engine.create();
    engine.gravity.y = -0.08; // Gentle upward gravity drift
    engine.gravity.x = 0;

    const particles = [];
    const particleCount = isMobile ? 15 : 40;
    const repulsionRadius = 130;
    const repulsionStrength = 0.0012;

    // Spawn initial particles
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 8 + 4; // Particle size 4px to 12px
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height + canvas.height * 0.1; // Spawn across screen
      
      const particle = Bodies.circle(x, y, radius, {
        frictionAir: 0.06,
        restitution: 0.8,
        label: 'bubble'
      });
      
      // Set random initial upward velocity
      Body.setVelocity(particle, {
        x: (Math.random() - 0.5) * 0.5,
        y: -Math.random() * 0.8 - 0.2
      });

      // Track rendering properties (like colors)
      particle.glowColor = i % 3 === 0 
        ? 'rgba(6, 182, 212, ' // Cyan
        : i % 3 === 1 
          ? 'rgba(59, 130, 246, ' // Blue
          : 'rgba(168, 85, 247, '; // Purple

      particles.push(particle);
      World.add(engine.world, particle);
    }

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let animationFrameId;
    
    const update = () => {
      // Step the engine
      Engine.update(engine, 1000 / 60);

      // 1. Subtle trail clear effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // Draw faint gravity fields lines if mouse is in viewport
      if (mouse.x > -1000) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, repulsionRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      particles.forEach((p) => {
        const { x, y } = p.position;
        const radius = p.circleRadius;

        // Reset particles that float off the top screen boundary
        if (y < -30) {
          Body.setPosition(p, {
            x: Math.random() * canvas.width,
            y: canvas.height + 30
          });
          Body.setVelocity(p, {
            x: (Math.random() - 0.5) * 0.5,
            y: -Math.random() * 0.8 - 0.2
          });
        }

        // Apply mouse repulsion force
        if (mouse.x > -1000) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < repulsionRadius) {
            // Force drops off linearly with distance
            const forceMagnitude = (1 - distance / repulsionRadius) * repulsionStrength;
            const forceDirection = Vector.normalise({ x: dx, y: dy });
            const force = Vector.mult(forceDirection, forceMagnitude);
            
            Body.applyForce(p, p.position, force);

            // Draw gravity field lines from particle to cursor showing repulsion
            const lineAlpha = (1 - distance / repulsionRadius) * 0.12;
            ctx.strokeStyle = p.glowColor + lineAlpha + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        // Draw particle with glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.glowColor + '0.5)';
        ctx.fillStyle = p.glowColor + '0.8)';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset shadow configuration for standard rendering
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden w-full h-full bg-[#0a0a0f] pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
