import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Brain,
  Coffee,
  Sparkles,
  TrendingUp,
  Clock,
  Tv,
  HeartPulse,
  Sliders,
  ArrowRight,
  ShieldAlert,
  Zap,
  Target,
  Award,
} from "lucide-react";

const API_URL = "http://localhost:8000";

// Fallback benchmarks if class data is still empty
const BENCHMARKS = {
  studyHours: 6.5,
  attendance: 92,
  socialMedia: 1.5,
  netflix: 1.0,
  sleepHours: 7.5,
  mentalHealth: 8,
  exercise: 4,
};

export default function Advice({ user }) {
  const navigate = useNavigate();

  // Load user prediction & inputs from sessionStorage or state
  const [userData, setUserData] = useState(() => {
    try {
      const saved = sessionStorage.getItem("lastPrediction");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading last prediction", e);
    }
    return null;
  });

  const [topperData, setTopperData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch topper data from class ranking
  useEffect(() => {
    const fetchClassRanking = async () => {
      if (!user?.classId) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/predictions/ranking/${user.classId}`);
        const data = await res.json();
        if (data.success && data.ranking?.length > 0) {
          setTopperData(data.ranking[0]);
        }
      } catch (err) {
        console.error("Failed to fetch topper benchmarks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassRanking();
  }, [user?.classId]);

  // Extract student parameters with fallbacks
  const params = useMemo(() => {
    const p = userData?.parameters || {};
    return {
      age: Number(p.age ?? 20),
      studyHours: Number(p.studyHours ?? 3.5),
      attendance: Number(p.attendance ?? 75),
      socialMedia: Number(p.socialMedia ?? 3.0),
      netflix: Number(p.netflix ?? 2.0),
      sleepHours: Number(p.sleepHours ?? 6.5),
      mentalHealth: Number(p.mentalHealth ?? 6),
      exercise: Number(p.exercise ?? 2),
      gender: p.gender ?? "Male",
      dietQuality: p.dietQuality ?? "Average",
    };
  }, [userData]);

  const currentCGPA = Number(userData?.cgpa ?? 6.8);

  // Interactive "What-If" Simulator State
  const [simStudy, setSimStudy] = useState(params.studyHours);
  const [simAttendance, setSimAttendance] = useState(params.attendance);
  const [simSocial, setSimSocial] = useState(params.socialMedia);
  const [simNetflix, setSimNetflix] = useState(params.netflix);

  // Update simulation when params change
  useEffect(() => {
    setSimStudy(params.studyHours);
    setSimAttendance(params.attendance);
    setSimSocial(params.socialMedia);
    setSimNetflix(params.netflix);
  }, [params]);

  // Compute Simulated Potential CGPA
  const simulatedCGPA = useMemo(() => {
    const studyDelta = (simStudy - params.studyHours) * 0.28;
    const attDelta = ((simAttendance - params.attendance) / 10) * 0.18;
    const socialDelta = (params.socialMedia - simSocial) * 0.12;
    const netflixDelta = (params.netflix - simNetflix) * 0.08;

    const projected = currentCGPA + studyDelta + attDelta + socialDelta + netflixDelta;
    return Math.min(10.0, Math.max(1.0, Number(projected.toFixed(2))));
  }, [simStudy, simAttendance, simSocial, simNetflix, params, currentCGPA]);

  const cgpaGain = Number((simulatedCGPA - currentCGPA).toFixed(2));

  // Dynamic Customized Advice Generation Engine
  const customizedAdvice = useMemo(() => {
    const list = [];
    const topParams = topperData?.parameters || BENCHMARKS;

    // 1. Study Hours Advice
    const studyGap = Number((topParams.studyHours - params.studyHours).toFixed(1));
    if (params.studyHours < 4.0) {
      list.push({
        id: "study",
        priority: "Critical",
        category: "Core Academics",
        icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
        title: "Study Hours Optimization",
        current: `${params.studyHours} hrs/day`,
        benchmark: `${topParams.studyHours} hrs/day (Topper)`,
        gap: `${studyGap > 0 ? studyGap : 2.5} hrs deficit`,
        actionPlan:
          "Your current daily study duration is the biggest factor holding your score back. Aim for two 90-minute deep-work blocks daily using the Pomodoro technique (50 mins study / 10 mins rest). Eliminate all multitasking.",
        expectedBoost: "+0.8 to +1.4 CGPA",
        type: "warning",
      });
    } else if (params.studyHours < 6.0) {
      list.push({
        id: "study",
        priority: "High",
        category: "Core Academics",
        icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
        title: "Active Recall & Spaced Repetition",
        current: `${params.studyHours} hrs/day`,
        benchmark: `${topParams.studyHours} hrs/day (Topper)`,
        gap: `${studyGap > 0 ? studyGap : 1.0} hrs gap`,
        actionPlan:
          "You have a solid study foundation. To jump to the topper tier, shift from passive reading to active recall (flashcards, past exam questions) and add 1 extra hour of weekend practice.",
        expectedBoost: "+0.4 to +0.8 CGPA",
        type: "info",
      });
    } else {
      list.push({
        id: "study",
        priority: "Optimal",
        category: "Core Academics",
        icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
        title: "Elite Study Discipline",
        current: `${params.studyHours} hrs/day`,
        benchmark: `${topParams.studyHours} hrs/day`,
        gap: "On Track",
        actionPlan:
          "Your study volume matches or exceeds top-tier students. Focus on mastering difficult high-weightage topics and mock exams.",
        expectedBoost: "Score Defense",
        type: "success",
      });
    }

    // 2. Attendance Advice
    const attGap = topParams.attendance - params.attendance;
    if (params.attendance < 75) {
      list.push({
        id: "attendance",
        priority: "Critical",
        category: "Attendance & Internal Marks",
        icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
        title: "Emergency Attendance Recovery",
        current: `${params.attendance}%`,
        benchmark: `${topParams.attendance}% (Topper)`,
        gap: `${attGap}% behind topper`,
        actionPlan:
          "CRITICAL: Attendance below 75% severely impacts internal assessment marks and risks exam disbarment. Attend 100% of lectures over the next 4 weeks to lift your average above 80%.",
        expectedBoost: "+0.6 to +1.0 CGPA",
        type: "warning",
      });
    } else if (params.attendance < 88) {
      list.push({
        id: "attendance",
        priority: "Moderate",
        category: "Attendance & Internal Marks",
        icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />,
        title: "Classroom Engagement & Internal Scoring",
        current: `${params.attendance}%`,
        benchmark: `${topParams.attendance}% (Topper)`,
        gap: `${attGap}% gap`,
        actionPlan:
          "Raising your attendance to 90%+ unlocks full internal grading marks and gives direct exposure to professor hints about upcoming exam questions.",
        expectedBoost: "+0.3 to +0.6 CGPA",
        type: "info",
      });
    } else {
      list.push({
        id: "attendance",
        priority: "Optimal",
        category: "Attendance & Internal Marks",
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
        title: "Exemplary Attendance Rate",
        current: `${params.attendance}%`,
        benchmark: `${topParams.attendance}%`,
        gap: "Optimal",
        actionPlan:
          "Maintaining >90% attendance guarantees maximum internal assessment points and keeps you fully updated on all coursework.",
        expectedBoost: "Max Internal Points",
        type: "success",
      });
    }

    // 3. Social Media & Screen Time
    if (params.socialMedia > 2.5) {
      list.push({
        id: "social",
        priority: "High",
        category: "Distraction Control",
        icon: <Clock className="w-6 h-6 text-amber-600" />,
        title: "Social Media Distraction Cutback",
        current: `${params.socialMedia} hrs/day`,
        benchmark: `${topParams.socialMedia} hrs/day (Topper)`,
        gap: `${(params.socialMedia - topParams.socialMedia).toFixed(1)} hrs excess`,
        actionPlan:
          "Spending over 2.5 hours on social media drains cognitive stamina and causes attention fragmentation. Set app screen-time limits to 1.5 hours and use 'Do Not Disturb' during daytime study sessions.",
        expectedBoost: "+0.4 to +0.7 CGPA",
        type: "warning",
      });
    }

    // 4. Netflix & OTT Entertainment
    if (params.netflix > 1.5) {
      list.push({
        id: "netflix",
        priority: "Moderate",
        category: "Leisure Balance",
        icon: <Tv className="w-6 h-6 text-purple-600" />,
        title: "Binge-Watching Boundary Management",
        current: `${params.netflix} hrs/day`,
        benchmark: `${topParams.netflix} hrs/day (Topper)`,
        gap: `${(params.netflix - topParams.netflix).toFixed(1)} hrs excess`,
        actionPlan:
          "Restrict video streaming to weekends or as a celebratory reward after achieving daily study targets. Avoid starting new multi-episode series during midterms.",
        expectedBoost: "+0.2 to +0.5 CGPA",
        type: "info",
      });
    }

    // 5. Sleep & Mental Health
    if (params.sleepHours < 6.5) {
      list.push({
        id: "sleep",
        priority: "High",
        category: "Cognitive Recovery",
        icon: <Coffee className="w-6 h-6 text-indigo-600" />,
        title: "Sleep Deprivation Recovery",
        current: `${params.sleepHours} hrs/night`,
        benchmark: "7.5 hrs/night",
        gap: `${(7.5 - params.sleepHours).toFixed(1)} hrs deficit`,
        actionPlan:
          "Cognitive performance, working memory, and exam recall drop sharply with under 6.5 hours of sleep. Establish a consistent 11:30 PM bedtime to get at least 7.5 hours of restorative sleep.",
        expectedBoost: "+0.3 to +0.5 CGPA",
        type: "warning",
      });
    }

    // 6. Wellness & Stress
    if (params.mentalHealth < 6) {
      list.push({
        id: "mental",
        priority: "High",
        category: "Mental Well-Being",
        icon: <Brain className="w-6 h-6 text-rose-600" />,
        title: "Stress Reduction & Mental Stamina",
        current: `${params.mentalHealth} / 10`,
        benchmark: "8+ / 10",
        gap: "High Academic Stress",
        actionPlan:
          "High anxiety impairs memory retention during tests. Incorporate a daily 20-minute walk, short meditation, and seek study group support to reduce burnout.",
        expectedBoost: "+0.3 to +0.6 CGPA",
        type: "info",
      });
    }

    return list;
  }, [params, topperData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-flex items-center gap-1.5 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          AI Performance Prescription
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Customized CGPA Growth Roadmap
        </h2>
        <p className="text-slate-600 text-base">
          Tailored recommendations generated by analyzing your specific habits against top-performing student benchmarks.
        </p>
      </div>

      {/* OVERVIEW SCORE BANNER */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-800/60 px-3 py-1 rounded-full border border-indigo-700">
              Personal Diagnostic
            </span>
            <h3 className="text-2xl lg:text-3xl font-extrabold leading-tight">
              You are currently projected at{" "}
              <span className="text-indigo-400 underline decoration-indigo-500/50">
                {currentCGPA.toFixed(2)} CGPA
              </span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Based on your study hours ({params.studyHours}h), attendance ({params.attendance}%), and screen time ({params.socialMedia}h), our machine learning model detected specific habit bottlenecks. Following the action plan below can unlock an estimated{" "}
              <span className="text-emerald-400 font-bold">+1.2 to +1.8 CGPA boost</span>.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start text-xs">
              <span className="px-3 py-1 bg-white/10 rounded-full text-indigo-200">
                📚 Study Target: {topperData?.parameters?.studyHours || BENCHMARKS.studyHours}h
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-emerald-200">
                🎯 Attendance Target: {topperData?.parameters?.attendance || BENCHMARKS.attendance}%
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-amber-200">
                📱 Max Social: {topperData?.parameters?.socialMedia || BENCHMARKS.socialMedia}h
              </span>
            </div>
          </div>

          {/* Large CGPA Potential Indicator */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center min-w-[240px] shadow-inner flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-1">
              Simulated Potential
            </span>
            <div className="text-6xl font-black text-white tracking-tight my-1">
              {simulatedCGPA.toFixed(2)}
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4" />
              {cgpaGain >= 0 ? `+${cgpaGain} CGPA Gain` : `${cgpaGain} CGPA Loss`}
            </div>
            <button
              onClick={() => navigate("/form")}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              Re-Predict with New Habits
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient decorative lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl -ml-28 -mb-28 pointer-events-none" />
      </div>

      {/* ====================================================
          SECTION 2: INTERACTIVE "WHAT-IF" CGPA SIMULATOR
          ==================================================== */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Interactive CGPA Simulator
              </h3>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Adjust your daily habits below to test how improving study hours, attendance, or screen time impacts your projected CGPA in real-time.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Current Baseline:</span>
              <span className="font-bold text-slate-700 text-sm">{currentCGPA.toFixed(2)} CGPA</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block font-medium">Projected Outcome:</span>
              <span className="font-bold text-indigo-600 text-sm">{simulatedCGPA.toFixed(2)} CGPA</span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Sliders */}
        <div className="grid md:grid-cols-2 gap-8 pt-2">
          {/* Slider 1: Study Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center gap-2 text-slate-800">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Daily Study Hours:
              </span>
              <span className="text-indigo-600 font-extrabold text-base bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                {simStudy} hrs/day
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={simStudy}
              onChange={(e) => setSimStudy(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>1 hr (Low)</span>
              <span>Benchmark: {topperData?.parameters?.studyHours || BENCHMARKS.studyHours}h</span>
              <span>10 hrs (Max)</span>
            </div>
          </div>

          {/* Slider 2: Attendance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Attendance Percentage:
              </span>
              <span className="text-emerald-600 font-extrabold text-base bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                {simAttendance}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={simAttendance}
              onChange={(e) => setSimAttendance(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>50% (Disbarment)</span>
              <span>75% (Safe)</span>
              <span>100% (Perfect)</span>
            </div>
          </div>

          {/* Slider 3: Social Media */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center gap-2 text-slate-800">
                <Clock className="w-4 h-4 text-amber-600" />
                Social Media Hours:
              </span>
              <span className="text-amber-600 font-extrabold text-base bg-amber-50 px-2.5 py-0.5 rounded-lg">
                {simSocial} hrs/day
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={simSocial}
              onChange={(e) => setSimSocial(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0 hrs (Disciplined)</span>
              <span>Target: &lt; 1.5h</span>
              <span>8 hrs (Distracted)</span>
            </div>
          </div>

          {/* Slider 4: Netflix / OTT */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center gap-2 text-slate-800">
                <Tv className="w-4 h-4 text-purple-600" />
                Netflix / Video Entertainment:
              </span>
              <span className="text-purple-600 font-extrabold text-base bg-purple-50 px-2.5 py-0.5 rounded-lg">
                {simNetflix} hrs/day
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={simNetflix}
              onChange={(e) => setSimNetflix(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0 hrs (Focused)</span>
              <span>Target: &lt; 1h</span>
              <span>6 hrs (Heavy)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          SECTION 3: ACTIONABLE RECOMMENDATION CARDS
          ==================================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Targeted Action Cards
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Prioritized by potential score impact on your academic transcript.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {customizedAdvice.length} actionable directives
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customizedAdvice.map((advice) => (
            <AdviceCard key={advice.id} {...advice} />
          ))}
        </div>
      </div>

      {/* ====================================================
          SECTION 4: BLUEPRINT HIGH-PERFORMANCE SCHEDULE
          ==================================================== */}
      <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl relative overflow-hidden space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800 inline-block mb-2">
            Structured Execution
          </span>
          <h3 className="text-2xl font-black">
            The Topper Tier Daily Timetable Blueprint
          </h3>
          <p className="text-slate-400 text-xs">
            Adopt this proven structure to consistently reach 6+ study hours while preserving 7.5 hours of sleep.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <ScheduleSlot
            time="07:00 AM - 08:30 AM"
            title="Morning Prime Block"
            desc="Review toughest subjects and formulas while cognitive focus is at peak."
            tag="Deep Work"
            tagColor="text-indigo-400 bg-indigo-950/60"
          />

          <ScheduleSlot
            time="09:00 AM - 03:00 PM"
            title="Classroom Immersion"
            desc="100% active lecture participation, note taking & clearing doubts on the spot."
            tag="Attendance"
            tagColor="text-emerald-400 bg-emerald-950/60"
          />

          <ScheduleSlot
            time="04:30 PM - 07:30 PM"
            title="Problem Solving Sprint"
            desc="Past exam questions, code practice & problem solving. Phone on silent."
            tag="Practice"
            tagColor="text-amber-400 bg-amber-950/60"
          />

          <ScheduleSlot
            time="09:30 PM - 11:00 PM"
            title="Review & Wind Down"
            desc="30-min day recap, light leisure/dinner, screen off 30 mins before sleep."
            tag="Recovery"
            tagColor="text-purple-400 bg-purple-950/60"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

const AdviceCard = ({
  icon,
  title,
  category,
  priority,
  current,
  benchmark,
  gap,
  actionPlan,
  expectedBoost,
  type,
}) => {
  const priorityStyles = {
    Critical: "bg-rose-50 text-rose-700 border-rose-200",
    High: "bg-amber-50 text-amber-700 border-amber-200",
    Moderate: "bg-blue-50 text-blue-700 border-blue-200",
    Optimal: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              priorityStyles[priority] || "bg-slate-50 text-slate-700"
            }`}
          >
            {priority} Priority
          </span>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
          {category}
        </span>
        <h4 className="text-lg font-bold text-slate-900 mb-3">{title}</h4>

        {/* Current vs Benchmark Matrix */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl text-xs mb-4">
          <div>
            <span className="text-slate-400 block font-medium">Your Input:</span>
            <span className="font-bold text-slate-800">{current}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Topper Benchmark:</span>
            <span className="font-bold text-amber-600">{benchmark}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {actionPlan}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Potential CGPA Boost:</span>
        <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
          {expectedBoost}
        </span>
      </div>
    </motion.div>
  );
};

const ScheduleSlot = ({ time, title, desc, tag, tagColor }) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400">{time}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColor}`}>
          {tag}
        </span>
      </div>
      <h5 className="font-bold text-sm text-white mb-1.5">{title}</h5>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);
