import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ChevronDown, Phone, Award } from 'lucide-react';

import HeroCanvas from './components/HeroCanvas';
import FloatingSection from './components/FloatingSection';
import ProjectCard from './components/ProjectCard';
import LeetCodeOrbit from './components/LeetCodeOrbit';
import ClubBadge from './components/ClubBadge';
import { portfolioData } from './data/portfolio';

// Custom Hook to check for accessibility reduced motion preference
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  return reducedMotion;
};

export default function App() {
  const isReducedMotion = useReducedMotion();
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  
  // Custom Cursor Spring Physics
  const [cursorProps, cursorApi] = useSpring(() => ({
    x: -100,
    y: -100,
    scale: 1,
    immediate: isReducedMotion,
    config: { mass: 0.15, tension: 400, friction: 12 }
  }));

  useEffect(() => {
    const handleMove = (e) => {
      cursorApi.start({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [cursorApi]);

  // Handle Delegate Hover detection to scale custom cursor
  useEffect(() => {
    if (isReducedMotion) return;

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.glass-card') ||
        target.closest('.glass');
        
      if (isInteractive) {
        setIsHoveringInteractive(true);
        cursorApi.start({ scale: 1.8 });
      } else {
        setIsHoveringInteractive(false);
        cursorApi.start({ scale: 1 });
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [cursorApi, isReducedMotion]);

  // Framer Motion staggered transition variants for page loads
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isReducedMotion ? 0 : 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Custom Cursor elements (hidden on mobile and if reduced-motion active) */}
      {!isReducedMotion && (
        <>
          <animated.div
            style={{
              transform: cursorProps.scale.to((s) => `translate(-50%, -50%) scale(${s})`),
              x: cursorProps.x,
              y: cursorProps.y,
            }}
            className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400 pointer-events-none z-50 transition-colors duration-200 hidden lg:block ${
              isHoveringInteractive ? 'bg-cyan-500/15 border-cyan-300' : 'bg-transparent'
            }`}
          />
          <animated.div
            style={{ x: cursorProps.x, y: cursorProps.y }}
            className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden lg:block"
          />
        </>
      )}

      {/* 2. Transparent Navbar with Backdrop Blur */}
      <nav className="fixed top-0 left-0 w-full z-40 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <a href="#home" className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-80 transition-opacity">
          R.PORTFOLIO
        </a>
        <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wider text-slate-400">
          <a href="#about" className="hover:text-cyan-400 transition-colors">ABOUT</a>
          <a href="#education" className="hover:text-blue-400 transition-colors">EDUCATION</a>
          <a href="#clubs" className="hover:text-purple-400 transition-colors">CLUBS</a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">PROJECTS</a>
          <a href="#certifications" className="hover:text-purple-400 transition-colors">CERTIFICATIONS</a>
          <a href="#leetcode" className="hover:text-cyan-400 transition-colors">LEETCODE</a>
          <a href="#contact" className="hover:text-purple-400 transition-colors">CONTACT</a>
        </div>
        <a 
          href="#contact" 
          className="text-xs uppercase font-extrabold tracking-widest px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 glow-cyan"
        >
          Get In Touch
        </a>
      </nav>

      {/* 3. Hero canvas background & overlay */}
      <section id="home" className="relative w-full h-screen flex flex-col justify-center items-center select-none text-center px-6">
        <HeroCanvas />
        
        {/* Hero content overlay */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center pointer-events-auto mt-16">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-3 animate-pulse">
            {portfolioData.profile.name}
          </h1>
          <p className="text-sm md:text-lg font-bold text-slate-300 tracking-wider uppercase max-w-2xl leading-relaxed mb-6">
            {portfolioData.profile.subtitle}
          </p>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed mb-8">
            {portfolioData.profile.bio}
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center items-center py-4 px-6 md:px-12 rounded-2xl glass mb-8 border border-white/5 glow-blue bg-slate-950/40">
            {portfolioData.profile.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center px-4">
                <span className="text-xl md:text-2xl font-black text-cyan-400">{stat.value}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a
              href="#projects"
              className="text-xs uppercase font-extrabold tracking-widest px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-95 transition-opacity glow-cyan"
            >
              View Projects
            </a>
            <a
              href="/Reguveeran_A_.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase font-extrabold tracking-widest px-6 py-3.5 rounded-xl glass text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10 transition-colors"
            >
              Download Resume
            </a>
            <a
              href={portfolioData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase font-extrabold tracking-widest px-6 py-3.5 rounded-xl glass text-slate-300 border border-slate-700/30 hover:bg-slate-800/10 transition-colors"
            >
              GitHub
            </a>
            <a
              href={portfolioData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase font-extrabold tracking-widest px-6 py-3.5 rounded-xl glass text-slate-300 border border-slate-700/30 hover:bg-slate-800/10 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <a 
          href="#about" 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1.5 select-none pointer-events-auto"
        >
          <span className="text-[9px] uppercase tracking-widest font-extrabold">Discover More</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </a>
      </section>

      {/* 4. Page layout container */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 py-24 space-y-36"
      >
        
        {/* About Section */}
        <FloatingSection id="about" className="scroll-mt-28">
          <motion.div variants={itemVariants} className="flex flex-col gap-10">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">About Me</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <div className="lg:col-span-3 space-y-6 text-slate-400 leading-relaxed">
                {portfolioData.profile.aboutText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-base text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="lg:col-span-2">
                <div className="glass-card p-6 rounded-2xl border border-white/5 glow-purple">
                  <h3 className="text-lg font-bold text-slate-200 mb-4">Focus Foundations</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Building systems that blend intelligent deep learning nodes with production web environments. Dedicated to bridging clinical and industrial algorithms.
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Skills Grid */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-bold text-slate-200">Skills & Toolset</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioData.skillsCategories.map((cat, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 glow-cyan flex flex-col justify-between">
                    <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-3 pb-2 border-b border-white/5">
                      {cat.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-cyan-500/30 transition-colors duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </FloatingSection>

        {/* Education Section */}
        <FloatingSection id="education" className="scroll-mt-28">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-2">
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">Education</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded mb-6"></div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                My academic foundations in engineering, information technology, and scientific computing.
              </p>
            </div>
            <div className="md:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolioData.education.map((edu, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 glow-blue flex flex-col justify-between min-h-[160px]">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-400">{edu.duration}</span>
                      <h3 className="text-base font-bold text-slate-100 mt-1 leading-tight">{edu.degree}</h3>
                      <p className="text-xs text-slate-400 mt-1">{edu.institution}</p>
                    </div>
                    <div className="text-right mt-4 border-t border-white/5 pt-2 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Score</span>
                      <span className="text-sm font-black text-cyan-400">{edu.score}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coursework Tags */}
              <div className="glass-card p-4 rounded-xl border border-white/5 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Relevant Coursework</h4>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.coursework.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-lg bg-blue-500/5 text-cyan-400 border border-cyan-500/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </FloatingSection>

        {/* Clubs Section */}
        <FloatingSection id="clubs" className="scroll-mt-28">
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white text-center mb-4">Leadership & Community</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded mb-16"></div>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:items-start min-h-[280px]">
              {portfolioData.clubs.map((club, idx) => (
                <ClubBadge
                  key={idx}
                  clubName={club.name}
                  role={club.role}
                  description={club.details}
                  icon={idx === 0 ? "🏆" : "🩸"}
                />
              ))}
            </div>
          </motion.div>
        </FloatingSection>

        {/* Projects Section */}
        <FloatingSection id="projects" className="scroll-mt-28">
          <motion.div variants={itemVariants} className="space-y-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">Featured Projects</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded mx-auto md:mx-0"></div>
              <p className="text-sm text-slate-500 mt-4 max-w-md">
                Try dragging these cards around to feel their spring physics and hover tilt configurations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portfolioData.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  type={project.type}
                  desc={project.desc}
                  tech={project.tech}
                  link={project.link}
                />
              ))}
            </div>
          </motion.div>
        </FloatingSection>

        {/* Certifications Section */}
        <FloatingSection id="certifications" className="scroll-mt-28">
          <motion.div variants={itemVariants} className="space-y-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">Certifications</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded mx-auto md:mx-0"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioData.certifications.map((cert, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 glow-purple flex items-start gap-4">
                  <div className="text-2xl mt-0.5 text-purple-400">🏅</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">{cert.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold mt-1">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </FloatingSection>

        {/* LeetCode Section */}
        <FloatingSection id="leetcode" className="scroll-mt-28">
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white text-center mb-4">Problem Solving</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded mb-8"></div>
            
            <LeetCodeOrbit />

            {/* View Full Profile link */}
            <div className="mt-6 text-center z-10 relative">
              <a
                href={portfolioData.leetcode.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-extrabold tracking-wide text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 border-b border-cyan-400/20 pb-0.5"
              >
                leetcode.com/u/{portfolioData.leetcode.username} → View full profile
              </a>
            </div>

            {/* Focus Area Tag Cloud */}
            <div className="mt-8 max-w-md mx-auto text-center z-10 relative">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Core Problem Solving Focus</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {portfolioData.leetcode.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800/80 text-slate-400"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </FloatingSection>

        {/* Contact Section */}
        <FloatingSection id="contact" className="scroll-mt-28">
          <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-8">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">Let's Connect</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded mx-auto mb-6"></div>
              <p className="text-slate-400 max-w-md leading-relaxed mb-6">
                Whether you want to discuss machine learning applications, backend system design, or interactive frontend architectures, feel free to reach out.
              </p>

              {/* Email and Phone Box */}
              <div className="glass p-5 rounded-2xl border border-white/5 max-w-sm mx-auto w-full space-y-3 mt-4 text-sm text-slate-300 bg-slate-950/20">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5"><Mail size={12} /> Email</span>
                  <a href={`mailto:${portfolioData.contact.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold select-text">
                    {portfolioData.contact.email}
                  </a>
                </div>
                <div className="flex justify-between items-center px-2 border-t border-white/5 pt-3">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5"><Phone size={12} /> Phone</span>
                  <a href={`tel:${portfolioData.contact.phone}`} className="text-slate-200 hover:text-cyan-400 transition-colors font-bold select-text">
                    {portfolioData.contact.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <a 
                href={portfolioData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass border border-white/5 flex items-center justify-center text-slate-300 hover:text-purple-400 hover:border-purple-500/30 transition-all duration-300 glow-purple"
              >
                <Github size={20} />
              </a>
              <a 
                href={portfolioData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass border border-white/5 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 glow-blue"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href={portfolioData.contact.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass border border-white/5 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300 glow-cyan"
              >
                <span className="font-extrabold text-xs">LC</span>
              </a>
            </div>
          </motion.div>
        </FloatingSection>

      </motion.main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs text-slate-600 space-y-2">
        <p className="text-slate-400 italic">"Turning data into decisions and ideas into systems."</p>
        <p>© 2026 Reguveeran A · Built with Vite, React, Framer Motion & React Spring</p>
      </footer>
    </div>
  );
}
