import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, TrendingUp, Award, ShieldCheck, Zap, 
  BarChart3, BrainCircuit, Target, LineChart 
} from "lucide-react";

export default function Landing({ user }) {
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) navigate("/form");
    else navigate("/auth");
  };

  return (
    <div className="relative bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-40 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800 border-2 border-indigo-200 mb-12 tracking-wide uppercase">
              <Zap className="w-4 h-4 mr-2 fill-indigo-600" />
              Next-Gen Academic Intelligence
            </span>

            <div className="max-w-full px-4">
              <h1 className="text-6xl lg:text-[5.8rem] font-black text-slate-950 mb-12 tracking-tighter leading-[1.0]">
                EduPredict AI: <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700">
                  Performance Analytics <br className="hidden lg:block" /> & Guidance System
                </span>
              </h1>

              <p className="w-full text-2xl lg:text-[1.75rem] text-slate-700 mb-16 leading-relaxed max-w-[1300px] mx-auto font-medium">
                Our advanced intelligence engine transforms complex student behavioral data <br className="hidden lg:block" /> 
                into actionable academic foresight. We empower learners to predict future outcomes, <br className="hidden lg:block" /> 
                identify potential scholastic risks early, and unlock a customized roadmap <br className="hidden lg:block" /> 
                built specifically for personalized academic growth and excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={handleStart}
                className="px-12 py-5 bg-slate-950 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl hover:shadow-indigo-300 flex items-center justify-center gap-3 group"
              >
                Launch Analysis
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/analysis")}
                className="px-12 py-5 bg-white text-slate-800 border-4 border-slate-200 rounded-2xl font-bold text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all hover:shadow-lg"
              >
                Explore Benchmarks
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- DYNAMIC BACKGROUND & PARTICLE OVERLAY --- */}
        <div className="absolute top-0 left-0 z-10 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[150px] opacity-40" />
          <div className="absolute top-[30%] right-[5%] w-[700px] h-[700px] bg-violet-500 rounded-full blur-[150px] opacity-40" />
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-fuchsia-400 rounded-full blur-[180px] opacity-30" />
          <div className="absolute inset-0">
            <svg width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <ParticleGroup num={20} sizeRange={[3, 7]} duration={40} color="fill-indigo-400" />
              <ParticleGroup num={30} sizeRange={[2, 4]} duration={30} color="fill-violet-400" />
            </svg>
          </div>
        </div>
      </section>

      <hr className="border-slate-100 max-w-7xl mx-auto" />

      {/* ENHANCED: Professional Quick Stats Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0MzM4Y2EiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMCAwaDRwdjRIMHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <PremiumStat 
              item="95%" 
              label="Prediction Accuracy" 
              icon={<BrainCircuit />} 
            />
            <PremiumStat 
              item="12+" 
              label="Behavioral Factors" 
              icon={<Target />} 
            />
            <PremiumStat 
              item="Real-time" 
              label="Insights Generation" 
              icon={<Zap />} 
            />
            <PremiumStat 
              item="Data-Driven" 
              label="Recommendations" 
              icon={<LineChart />} 
            />
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* ENHANCED: Objective Section (The Vision) */}
      <section className="py-32 bg-slate-50/70 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-violet-100 rounded-full blur-[180px] opacity-40 -z-10" />

        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.25em] mb-6">The Vision</h2>
            <h3 className="text-5xl lg:text-6xl font-black text-slate-950 mb-12 tracking-tighter leading-[1.0]">Project Core Objective</h3>
            
            <p className="text-slate-700 text-2xl lg:text-[1.6rem] leading-relaxed font-medium mb-16 max-w-4xl mx-auto">
              We bridge the gap between raw student data and academic success. By analyzing attendance, social habits, and lifestyle patterns through Machine Learning, our system provides an early-warning framework to mitigate academic decline and foster excellence.
            </p>

            {/* Structured Objective Breakdown Cards */}
            <div className="grid md:grid-cols-3 gap-8 text-left border border-slate-200 rounded-[2.5rem] p-10 bg-white shadow-xl shadow-slate-100 relative z-20">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-xl">Mitigate Risk</h4>
                <p className="text-slate-600 text-base leading-relaxed">Early-warning flags to identify potential academic decline before it impacts GPA outcomes.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-xl">Maximize Success</h4>
                <p className="text-slate-600 text-base leading-relaxed">Tailored pathing that reinforces strengths and optimizes learning efficiency across all subjects.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-xl">Foster Excellence</h4>
                <p className="text-slate-600 text-base leading-relaxed">Benchmarks that encourage continuous growth against personal and global achievement standards.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* System Overview Section */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.25em] mb-6">Deep Dive</h2>
              <h3 className="text-5xl font-black text-slate-900 mb-8">How the Intelligence Works</h3>
              <p className="text-slate-600 text-xl leading-relaxed mb-10">
                Our engine processes high-dimensional behavioral data—from your study intensity 
                to social media lifestyle—to simulate potential academic paths.
              </p>
              <ul className="space-y-6">
                {['Predictive CGPA Modeling', 'Visual Performance Trajectories', 'Actionable Intervention Steps'].map((item) => (
                  <li key={item} className="flex items-center text-slate-900 text-xl font-bold gap-4">
                    <div className="p-1 bg-emerald-100 rounded-full">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full bg-slate-50 rounded-[3rem] h-80 lg:h-[450px] flex items-center justify-center border-2 border-slate-100 shadow-inner relative overflow-hidden">
                <BarChart3 className="w-32 h-32 text-slate-200" />
                <span className="absolute bottom-10 text-slate-400 font-bold uppercase tracking-widest text-sm">Analytics Dashboard Preview</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* Features Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900">Key Capabilities</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<TrendingUp className="w-12 h-12" />}
              title="Forecasting Engine"
              description="Utilizes regression models to project future academic standing based on current habits."
              color="indigo"
            />
            <FeatureCard 
              icon={<Award className="w-12 h-12" />}
              title="Global Benchmarking"
              description="Analyze where you stand relative to peer performance and institutional standards."
              color="emerald"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-12 h-12" />}
              title="Heuristic Insights"
              description="Custom-tailored study schedules and lifestyle adjustments generated by AI."
              color="amber"
            />
          </div>
        </div>
      </section>

    </div>
  );
}

// --- NEW SUB-COMPONENTS FOR ENHANCED LOOK ---

const PremiumStat = ({ item, label, icon }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group flex flex-col items-center p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="p-4 bg-indigo-50 rounded-2xl mb-6 text-indigo-600 relative z-10 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { className: "w-8 h-8 fill-indigo-100" })}
    </div>
    <span className="text-5xl font-black text-slate-950 mb-3 tracking-tighter relative z-10">{item}</span>
    <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] relative z-10">{label}</span>
  </motion.div>
);

const ParticleGroup = ({ num, sizeRange, duration, color }) => {
  const particles = Array.from({ length: num }).map((_, i) => ({
    id: i,
    r: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
    cx: Math.random() * 1600,
    cy: Math.random() * 900,
  }));

  return (
    <g className={color} filter="url(#glow)">
      {particles.map(p => (
        <motion.circle
          key={p.id}
          r={p.r}
          cx={p.cx}
          cy={p.cy}
          opacity={0.2}
          animate={{
            cy: [p.cy, p.cy - 120, p.cy + 120, p.cy],
            cx: [p.cx, p.cx + 50, p.cx - 50, p.cx],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: Math.random() * 20 + duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50"
  };

  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="p-12 rounded-[2.5rem] border border-slate-200 bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all group"
    >
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-10 ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="text-3xl font-black text-slate-950 mb-6">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-xl">{description}</p>
    </motion.div>
  );
};