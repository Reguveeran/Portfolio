import { useEffect, useRef, useState } from 'react';
import { Award } from 'lucide-react';

export default function LeetCodeOrbit() {
  const [stats, setStats] = useState({
    totalSolved: 167,
    totalQuestions: 3957,
    easySolved: 84,
    easyTotal: 949,
    mediumSolved: 72,
    mediumTotal: 2066,
    hardSolved: 11,
    hardTotal: 942,
    ranking: 981366,
    loading: true,
    error: null
  });

  const [hoveredDiff, setHoveredDiff] = useState(null);

  const containerRef = useRef(null);
  const easyRef = useRef(null);
  const mediumRef = useRef(null);
  const hardRef = useRef(null);

  const anglesRef = useRef({ easy: 0, medium: 2.1, hard: 4.2 }); // Stagger initial angles
  const isPausedRef = useRef(false);

  useEffect(() => {
    // Fetch live data (CORS fallback is pre-configured in state)
    const fetchLeetCodeStats = async () => {
      const query = `
        query userProblemsSolved($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
            }
          }
        }
      `;

      try {
        const response = await fetch('https://leetcode-stats-api.herokuapp.com/Reguveeran');
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setStats({
              totalSolved: data.totalSolved,
              totalQuestions: data.totalQuestions,
              easySolved: data.easySolved,
              easyTotal: data.totalEasy,
              mediumSolved: data.mediumSolved,
              mediumTotal: data.totalMedium,
              hardSolved: data.hardSolved,
              hardTotal: data.totalHard,
              ranking: data.ranking || 981366,
              loading: false,
              error: null
            });
            return;
          }
        }
      } catch (err) {
        console.warn("LeetCode direct fetch blocked by CORS/Network. Using pre-loaded clinical developer stats.", err);
      }
      // Set loading to false so fallback counts are rendered
      setStats(prev => ({ ...prev, loading: false }));
    };

    fetchLeetCodeStats();
  }, []);

  useEffect(() => {
    let animFrameId;

    const updateOrbits = () => {
      if (!isPausedRef.current) {
        // Increment angles at different rates based on orbit period (60 FPS assumed)
        anglesRef.current.easy += (2 * Math.PI) / (4 * 60);   // 4s period
        anglesRef.current.medium += (2 * Math.PI) / (7 * 60); // 7s period
        anglesRef.current.hard += (2 * Math.PI) / (11 * 60);  // 11s period

        // Elliptical radii
        const orbits = [
          { ref: easyRef, angle: anglesRef.current.easy, rx: 110, ry: 45 },
          { ref: mediumRef, angle: anglesRef.current.medium, rx: 160, ry: 60 },
          { ref: hardRef, angle: anglesRef.current.hard, rx: 210, ry: 75 }
        ];

        orbits.forEach(({ ref, angle, rx, ry }) => {
          if (ref.current) {
            const x = rx * Math.cos(angle);
            const y = ry * Math.sin(angle);
            
            // 3D Depth scaling based on y coordinate (positive y is "in front", negative is "behind")
            const scale = y > 0 
              ? 1 + (y / ry) * 0.15 
              : 1 + (y / ry) * 0.15;
              
            const zIndex = y > 0 ? 20 : 5;
            const opacity = y > 0 ? 1 : 0.7;

            ref.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
            ref.current.style.zIndex = zIndex;
            ref.current.style.opacity = opacity;
          }
        });
      }

      animFrameId = requestAnimationFrame(updateOrbits);
    };

    updateOrbits();

    return () => cancelAnimationFrame(animFrameId);
  }, []);

  const handleMouseEnter = (difficulty) => {
    isPausedRef.current = true;
    setHoveredDiff(difficulty);
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    setHoveredDiff(null);
  };

  const getDifficultyData = () => {
    switch (hoveredDiff) {
      case 'Easy':
        return {
          solved: stats.easySolved,
          total: stats.easyTotal,
          percent: ((stats.easySolved / stats.easyTotal) * 100).toFixed(1),
          color: 'text-emerald-400'
        };
      case 'Medium':
        return {
          solved: stats.mediumSolved,
          total: stats.mediumTotal,
          percent: ((stats.mediumSolved / stats.mediumTotal) * 100).toFixed(1),
          color: 'text-amber-400'
        };
      case 'Hard':
        return {
          solved: stats.hardSolved,
          total: stats.hardTotal,
          percent: ((stats.hardSolved / stats.hardTotal) * 100).toFixed(1),
          color: 'text-rose-400'
        };
      default:
        return null;
    }
  };

  const activeData = getDifficultyData();

  return (
    <div className="flex flex-col items-center justify-center py-12 relative w-full overflow-hidden min-h-[450px]">
      
      {/* Central Orbit Container */}
      <div ref={containerRef} className="relative w-full max-w-[500px] h-[300px] flex items-center justify-center">
        
        {/* Orbit Path Ellipses */}
        <div className="absolute w-[220px] h-[90px] border border-slate-800/40 rounded-[50%] pointer-events-none z-0"></div>
        <div className="absolute w-[320px] h-[120px] border border-slate-800/40 rounded-[50%] pointer-events-none z-0"></div>
        <div className="absolute w-[420px] h-[150px] border border-slate-800/40 rounded-[50%] pointer-events-none z-0"></div>

        {/* Central Solved Ring */}
        <div className="absolute z-10 w-36 h-36 rounded-full glass border border-blue-500/20 flex flex-col items-center justify-center glow-blue text-center select-none bg-slate-950/80">
          {activeData ? (
            <div className="animate-fade-in">
              <span className={`text-xs uppercase font-extrabold tracking-wider ${activeData.color}`}>
                {hoveredDiff}
              </span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {activeData.solved}
              </div>
              <span className="text-[10px] text-slate-500">
                / {activeData.total} ({activeData.percent}%)
              </span>
            </div>
          ) : (
            <div>
              <Award className="text-cyan-400 mb-1 mx-auto" size={24} />
              <div className="text-3xl font-extrabold text-white leading-none">
                {stats.totalSolved}
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">
                Solved
              </span>
              {stats.ranking && (
                <span className="text-[9px] text-cyan-400/80 block mt-1">
                  Rank: #{stats.ranking.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Easy Sphere (Green) */}
        <div
          ref={easyRef}
          onMouseEnter={() => handleMouseEnter('Easy')}
          onMouseLeave={handleMouseLeave}
          className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full bg-[#052e16] border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer select-none transition-shadow hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {stats.easySolved}
        </div>

        {/* Medium Sphere (Yellow) */}
        <div
          ref={mediumRef}
          onMouseEnter={() => handleMouseEnter('Medium')}
          onMouseLeave={handleMouseLeave}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-[#451a03] border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer select-none transition-shadow hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {stats.mediumSolved}
        </div>

        {/* Hard Sphere (Red) */}
        <div
          ref={hardRef}
          onMouseEnter={() => handleMouseEnter('Hard')}
          onMouseLeave={handleMouseLeave}
          className="absolute top-1/2 left-1/2 w-11 h-11 rounded-full bg-[#450a0a] border border-rose-500/40 flex items-center justify-center text-xs font-bold text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer select-none transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {stats.hardSolved}
        </div>

      </div>

      <div className="text-center text-sm text-slate-500 max-w-xs mt-4">
        Hover over the orbits to see difficulty breakdown, total stats, and submission accuracy.
      </div>
    </div>
  );
}
