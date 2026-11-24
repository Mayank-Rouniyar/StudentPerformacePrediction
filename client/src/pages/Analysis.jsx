import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BarChart3,
  Users,
  TrendingUp,
  CalendarDays,
  Loader2,
  Award,
  User,
  Layers,
  LayoutGrid,
  BookOpen,
  Clock,
  Tv,
  CheckCircle2,
  Sparkles,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const API_URL = "http://localhost:8000";

// Fallback benchmarks if class has fresh/empty records
const DEFAULT_TOPPER_PARAMS = {
  studyHours: 6.8,
  attendance: 94,
  socialMedia: 1.2,
  netflix: 0.8,
  sleepHours: 7.5,
  mentalHealth: 8.5,
  exercise: 4,
};

const DEFAULT_AVG_PARAMS = {
  studyHours: 4.2,
  attendance: 82,
  socialMedia: 2.8,
  netflix: 1.8,
  sleepHours: 6.7,
  mentalHealth: 6.2,
  exercise: 2.5,
};

// Custom Tooltip for Line & Bar charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-1.5 min-w-[190px]">
        <p className="font-semibold text-slate-700 text-xs border-b border-slate-100 pb-1 mb-1">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span
              className="flex items-center gap-1.5 font-medium"
              style={{ color: entry.color }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-800">
              {entry.value !== null && entry.value !== undefined
                ? `${Number(entry.value).toFixed(1)} ${entry.unit || ""}`
                : "N/A"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analysis({ user }) {
  const [predictions, setPredictions] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timelineView, setTimelineView] = useState("all"); // 'all', 'combined', 'separate'

  /*
  ====================================================
  FETCH CLASS DATA
  ====================================================
  */
  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!user?.classId) {
        setError("Class information is missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [historyResponse, rankingResponse] = await Promise.all([
          fetch(`${API_URL}/api/predictions/class/${user.classId}`),
          fetch(`${API_URL}/api/predictions/ranking/${user.classId}`),
        ]);

        const historyData = await historyResponse.json();
        const rankingData = await rankingResponse.json();

        if (!historyResponse.ok || !historyData.success) {
          throw new Error(
            historyData.message || "Failed to fetch prediction history"
          );
        }

        if (!rankingResponse.ok || !rankingData.success) {
          throw new Error(
            rankingData.message || "Failed to fetch class ranking"
          );
        }

        setPredictions(historyData.predictions || []);
        setRanking(rankingData.ranking || []);
      } catch (err) {
        console.error("Analysis Error:", err);
        setError(err.message || "Failed to load analysis data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [user?.classId]);

  /*
  ====================================================
  CURRENT STUDENT & TOPPER
  ====================================================
  */
  const currentStudent = useMemo(() => {
    return ranking.find(
      (student) =>
        student.studentId?.toString() === user?._id?.toString()
    );
  }, [ranking, user]);

  const topperStudent = useMemo(() => {
    return ranking.length > 0 ? ranking[0] : null;
  }, [ranking]);

  /*
  ====================================================
  RETRIEVE PARAMETERS FOR USER, TOPPER & CLASS AVG
  ====================================================
  */
  const { userParams, topperParams, avgParams } = useMemo(() => {
    // 1. Current User Parameters (from backend or sessionStorage fallback)
    let uParams = currentStudent?.parameters || null;
    if (!uParams) {
      try {
        const stored = sessionStorage.getItem("lastPrediction");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.parameters) uParams = parsed.parameters;
        }
      } catch (e) {
        console.error("Session parse error", e);
      }
    }
    const finalUserParams = {
      studyHours: Number(uParams?.studyHours ?? 4),
      attendance: Number(uParams?.attendance ?? 75),
      socialMedia: Number(uParams?.socialMedia ?? 2.5),
      netflix: Number(uParams?.netflix ?? 1.5),
      sleepHours: Number(uParams?.sleepHours ?? 7),
      mentalHealth: Number(uParams?.mentalHealth ?? 7),
      exercise: Number(uParams?.exercise ?? 3),
    };

    // Helper to resolve parameters with fallback for any student
    const resolveParams = (student) => {
      const p = student?.parameters || {};
      const ratio = Math.max(0, Math.min(1, ((Number(student?.predictedCGPA) || 7.0) - 4) / 6));
      return {
        studyHours: Number(p.studyHours ?? (1.5 + ratio * 5.3).toFixed(1)),
        attendance: Number(p.attendance ?? Math.round(65 + ratio * 32)),
        socialMedia: Number(p.socialMedia ?? (4.5 - ratio * 3.2).toFixed(1)),
        netflix: Number(p.netflix ?? (2.8 - ratio * 2.0).toFixed(1)),
        sleepHours: Number(p.sleepHours ?? (6.0 + ratio * 1.5).toFixed(1)),
        mentalHealth: Number(p.mentalHealth ?? Math.round(5 + ratio * 4)),
        exercise: Number(p.exercise ?? Math.round(1 + ratio * 4)),
      };
    };

    // 2. Class Topper Parameters
    const finalTopperParams = topperStudent ? resolveParams(topperStudent) : { ...DEFAULT_TOPPER_PARAMS };

    // 3. Class Average Parameters across all students
    let finalAvgParams = { ...DEFAULT_AVG_PARAMS };
    if (ranking.length > 0) {
      const allStudentParams = ranking.map((s) => resolveParams(s));
      const sum = allStudentParams.reduce(
        (acc, curr) => ({
          studyHours: acc.studyHours + curr.studyHours,
          attendance: acc.attendance + curr.attendance,
          socialMedia: acc.socialMedia + curr.socialMedia,
          netflix: acc.netflix + curr.netflix,
          sleepHours: acc.sleepHours + curr.sleepHours,
          mentalHealth: acc.mentalHealth + curr.mentalHealth,
          exercise: acc.exercise + curr.exercise,
        }),
        { studyHours: 0, attendance: 0, socialMedia: 0, netflix: 0, sleepHours: 0, mentalHealth: 0, exercise: 0 }
      );
      const count = allStudentParams.length;
      finalAvgParams = {
        studyHours: Number((sum.studyHours / count).toFixed(1)),
        attendance: Number((sum.attendance / count).toFixed(1)),
        socialMedia: Number((sum.socialMedia / count).toFixed(1)),
        netflix: Number((sum.netflix / count).toFixed(1)),
        sleepHours: Number((sum.sleepHours / count).toFixed(1)),
        mentalHealth: Number((sum.mentalHealth / count).toFixed(1)),
        exercise: Number((sum.exercise / count).toFixed(1)),
      };
    }

    return {
      userParams: finalUserParams,
      topperParams: finalTopperParams,
      avgParams: finalAvgParams,
    };
  }, [currentStudent, topperStudent, ranking]);

  /*
  ====================================================
  PARAMETER COMPARISON BAR DATA (User vs Avg vs Topper)
  ====================================================
  */
  const parameterComparisonData = useMemo(() => {
    return [
      {
        parameter: "Study Hours",
        User: userParams.studyHours,
        Average: avgParams.studyHours,
        Topper: topperParams.studyHours,
        unit: "hrs/day",
      },
      {
        parameter: "Attendance",
        User: userParams.attendance,
        Average: avgParams.attendance,
        Topper: topperParams.attendance,
        unit: "%",
      },
      {
        parameter: "Social Media",
        User: userParams.socialMedia,
        Average: avgParams.socialMedia,
        Topper: topperParams.socialMedia,
        unit: "hrs/day",
      },
      {
        parameter: "Netflix / TV",
        User: userParams.netflix,
        Average: avgParams.netflix,
        Topper: topperParams.netflix,
        unit: "hrs/day",
      },
      {
        parameter: "Sleep Hours",
        User: userParams.sleepHours,
        Average: avgParams.sleepHours,
        Topper: topperParams.sleepHours,
        unit: "hrs/night",
      },
      {
        parameter: "Mental Health",
        User: userParams.mentalHealth,
        Average: avgParams.mentalHealth,
        Topper: topperParams.mentalHealth,
        unit: "/10",
      },
    ];
  }, [userParams, avgParams, topperParams]);

  /*
  ====================================================
  RADAR CHART DATA (Normalized 0 - 100)
  ====================================================
  */
  const radarData = useMemo(() => {
    // Normalization helper
    const normStudy = (val) => Math.min(100, Math.round((val / 8) * 100));
    const normAtt = (val) => Math.min(100, Math.round(val));
    const normScreen = (soc, net) => Math.max(10, Math.min(100, Math.round(100 - (soc + net) * 10)));
    const normSleep = (val) => {
      // 7-8 hrs is 100%, drops if too low or excessive
      const diff = Math.abs(val - 7.5);
      return Math.max(20, Math.min(100, Math.round(100 - diff * 20)));
    };
    const normMental = (val) => Math.min(100, Math.round(val * 10));
    const normExercise = (val) => Math.min(100, Math.round((val / 6) * 100));

    return [
      {
        subject: "Study Focus",
        User: normStudy(userParams.studyHours),
        Average: normStudy(avgParams.studyHours),
        Topper: normStudy(topperParams.studyHours),
        fullMark: 100,
      },
      {
        subject: "Attendance",
        User: normAtt(userParams.attendance),
        Average: normAtt(avgParams.attendance),
        Topper: normAtt(topperParams.attendance),
        fullMark: 100,
      },
      {
        subject: "Screen Discipline",
        User: normScreen(userParams.socialMedia, userParams.netflix),
        Average: normScreen(avgParams.socialMedia, avgParams.netflix),
        Topper: normScreen(topperParams.socialMedia, topperParams.netflix),
        fullMark: 100,
      },
      {
        subject: "Sleep Balance",
        User: normSleep(userParams.sleepHours),
        Average: normSleep(avgParams.sleepHours),
        Topper: normSleep(topperParams.sleepHours),
        fullMark: 100,
      },
      {
        subject: "Mental Wellness",
        User: normMental(userParams.mentalHealth),
        Average: normMental(avgParams.mentalHealth),
        Topper: normMental(topperParams.mentalHealth),
        fullMark: 100,
      },
      {
        subject: "Physical Activity",
        User: normExercise(userParams.exercise),
        Average: normExercise(avgParams.exercise),
        Topper: normExercise(topperParams.exercise),
        fullMark: 100,
      },
    ];
  }, [userParams, avgParams, topperParams]);

  /*
  ====================================================
  CLASS AVERAGE CGPA
  ====================================================
  */
  const classAverageCGPA = useMemo(() => {
    if (ranking.length === 0) return "0.00";
    const total = ranking.reduce(
      (sum, student) => sum + Number(student.predictedCGPA || 0),
      0
    );
    return (total / ranking.length).toFixed(2);
  }, [ranking]);

  /*
  ====================================================
  TIMELINE CHART DATA (3 Lines)
  1. Current User Performance
  2. Class Average Predicted
  3. Class Topper Predicted
  ====================================================
  */
  const chartData = useMemo(() => {
    if (!predictions || predictions.length === 0) return [];

    const currentUserId = user?._id?.toString();
    const topperId = topperStudent?.studentId?.toString();

    const getStudentId = (pred) => {
      if (!pred || !pred.student) return null;
      if (typeof pred.student === "object") {
        return pred.student._id
          ? pred.student._id.toString()
          : pred.student.toString();
      }
      return pred.student.toString();
    };

    const sorted = [...predictions].sort(
      (a, b) => new Date(a.predictionDate) - new Date(b.predictionDate)
    );

    const dateSet = new Set(
      sorted.map((p) => new Date(p.predictionDate).toISOString().split("T")[0])
    );
    const isSameDay = dateSet.size <= 1;

    const grouped = new Map();

    sorted.forEach((pred, index) => {
      const dateObj = new Date(pred.predictionDate);
      const dateKey = isSameDay
        ? `Attempt ${index + 1} (${dateObj.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })})`
        : dateObj.toISOString().split("T")[0];

      const displayLabel = isSameDay
        ? `Attempt ${index + 1}`
        : dateObj.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, {
          key: dateKey,
          label: displayLabel,
          allScores: [],
          userScores: [],
          topperScores: [],
        });
      }

      const item = grouped.get(dateKey);
      const score = Number(pred.predictedCGPA);
      item.allScores.push(score);

      const sid = getStudentId(pred);
      if (currentUserId && sid === currentUserId) {
        item.userScores.push(score);
      }
      if (topperId && sid === topperId) {
        item.topperScores.push(score);
      }
    });

    let lastKnownTopperScore = topperStudent
      ? Number(topperStudent.predictedCGPA)
      : null;

    return Array.from(grouped.values()).map((entry) => {
      let userScore = null;
      if (entry.userScores.length > 0) {
        userScore =
          entry.userScores.reduce((a, b) => a + b, 0) /
          entry.userScores.length;
      }

      const avgScore =
        entry.allScores.reduce((a, b) => a + b, 0) / entry.allScores.length;

      let topperScore = null;
      if (entry.topperScores.length > 0) {
        topperScore =
          entry.topperScores.reduce((a, b) => a + b, 0) /
          entry.topperScores.length;
        lastKnownTopperScore = topperScore;
      } else {
        const batchMax = Math.max(...entry.allScores);
        topperScore =
          lastKnownTopperScore !== null
            ? Math.max(batchMax, lastKnownTopperScore)
            : batchMax;
      }

      return {
        date: entry.label,
        userPerformance:
          userScore !== null ? Number(userScore.toFixed(2)) : null,
        classAverage: Number(avgScore.toFixed(2)),
        classTopper:
          topperScore !== null ? Number(topperScore.toFixed(2)) : null,
      };
    });
  }, [predictions, user, topperStudent]);

  /*
  ====================================================
  LOADING / ERROR STATES
  ====================================================
  */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading class analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to Load Analysis</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Comparative Intelligence
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mt-2 mb-1">
            Performance & Habit Analytics
          </h2>
          <p className="text-slate-600 text-sm">
            Compare your study hours, attendance, screen time & predicted CGPA directly with the class average and topper.
          </p>
        </div>

        {/* View Mode Switcher for Timeline */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setTimelineView("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              timelineView === "all"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All Views
          </button>
          <button
            onClick={() => setTimelineView("combined")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              timelineView === "combined"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3-Line Plot
          </button>
          <button
            onClick={() => setTimelineView("separate")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              timelineView === "separate"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            3 Separate Plots
          </button>
        </div>
      </div>

      {/* TOP STAT CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Your Predicted CGPA"
          value={
            currentStudent
              ? `${Number(currentStudent.predictedCGPA).toFixed(2)}`
              : "N/A"
          }
          subtitle="Latest assessment"
          icon={<User className="w-5 h-5 text-indigo-600" />}
          badgeColor="bg-indigo-50"
        />

        <StatCard
          title="Class Rank"
          value={
            currentStudent
              ? `#${currentStudent.rank} / ${ranking.length}`
              : "N/A"
          }
          subtitle="Cohort standing"
          icon={<Users className="w-5 h-5 text-emerald-600" />}
          badgeColor="bg-emerald-50"
        />

        <StatCard
          title="Class Average CGPA"
          value={`${classAverageCGPA}`}
          subtitle="Class average"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          badgeColor="bg-blue-50"
        />

        <StatCard
          title="Class Topper CGPA"
          value={
            topperStudent
              ? `${Number(topperStudent.predictedCGPA).toFixed(2)}`
              : "N/A"
          }
          subtitle={topperStudent ? topperStudent.name : "Benchmark"}
          icon={<Award className="w-5 h-5 text-amber-600" />}
          badgeColor="bg-amber-50"
        />
      </div>

      {/* ====================================================
          SECTION 1: THE 3-LINE CGPA PREDICTION PLOTS
          ==================================================== */}
      {(timelineView === "all" || timelineView === "combined") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Comparative Predicted CGPA Trend
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  3 Lines Plot
                </span>
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Progression comparison: (1) Your Performance vs (2) Class Average vs (3) Class Topper.
              </p>
            </div>

            {/* Custom Legend Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                Your Performance
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Class Average
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Class Topper
              </span>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-slate-500">
              No prediction history recorded yet.
            </div>
          ) : (
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />

                  <Line
                    type="monotone"
                    dataKey="userPerformance"
                    name="Your Performance"
                    stroke="#6366f1"
                    strokeWidth={3.5}
                    dot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 8 }}
                    connectNulls={true}
                  />

                  <Line
                    type="monotone"
                    dataKey="classAverage"
                    name="Class Average Predicted"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="classTopper"
                    name="Class Topper Predicted"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      )}

      {/* SEPARATE 3 PLOTS */}
      {(timelineView === "all" || timelineView === "separate") && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Individual Dimension Plots
            </h3>
            <p className="text-sm text-slate-500">
              Isolated trajectory for each key benchmark.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Plot 1: Current User */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    Plot 1
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Scale: 0 - 10</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Current User Performance</h4>
                <p className="text-xs text-slate-500 mb-4">Your individual predicted CGPA over time.</p>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="userPerformance"
                      name="Your Performance"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#6366f1" }}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Latest CGPA:</span>
                <span className="font-bold text-indigo-600 text-sm">
                  {currentStudent ? `${Number(currentStudent.predictedCGPA).toFixed(2)}` : "No test"}
                </span>
              </div>
            </div>

            {/* Plot 2: Class Average */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Plot 2
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Class Average</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Class Average Predicted</h4>
                <p className="text-xs text-slate-500 mb-4">Cohort mean predicted score evolution.</p>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="classAverage"
                      name="Class Average"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Cohort Average:</span>
                <span className="font-bold text-emerald-600 text-sm">{classAverageCGPA} CGPA</span>
              </div>
            </div>

            {/* Plot 3: Class Topper */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    Plot 3
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Rank #1 Target</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Class Topper Predicted</h4>
                <p className="text-xs text-slate-500 mb-4">Top benchmark trajectory in class.</p>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="classTopper"
                      name="Class Topper"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[140px]">
                  {topperStudent ? topperStudent.name : "Benchmark"}:
                </span>
                <span className="font-bold text-amber-600 text-sm">
                  {topperStudent ? `${Number(topperStudent.predictedCGPA).toFixed(2)} CGPA` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          SECTION 2: PARAMETER COMPARISON (BAR & RADAR GRAPHS)
          Study Hours, Attendance, Social Media, Netflix, Sleep
          ==================================================== */}
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Behavioral Parameter Comparison
          </h3>
          <p className="text-slate-500 text-sm">
            Visual breakdown comparing your inputs with the class average and topper.
          </p>
        </div>

        {/* 6 Key Parameter Quick Gap Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ParamGapCard
            title="Study Hours"
            userVal={`${userParams.studyHours} hrs/day`}
            avgVal={`${avgParams.studyHours} hrs`}
            topVal={`${topperParams.studyHours} hrs`}
            gap={userParams.studyHours - topperParams.studyHours}
            unit="hrs"
            icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
            color="indigo"
            advice="Toppers dedicate ~6.5+ hrs daily"
          />

          <ParamGapCard
            title="Attendance Rate"
            userVal={`${userParams.attendance}%`}
            avgVal={`${avgParams.attendance}%`}
            topVal={`${topperParams.attendance}%`}
            gap={userParams.attendance - topperParams.attendance}
            unit="%"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            color="emerald"
            advice="High attendance correlates with top grades"
          />

          <ParamGapCard
            title="Social Media Screen Time"
            userVal={`${userParams.socialMedia} hrs/day`}
            avgVal={`${avgParams.socialMedia} hrs`}
            topVal={`${topperParams.socialMedia} hrs`}
            gap={topperParams.socialMedia - userParams.socialMedia} // inverse: lower is better
            unit="hrs"
            inverse={true}
            icon={<Clock className="w-5 h-5 text-rose-600" />}
            color="rose"
            advice="Toppers keep social media under 1.5 hrs"
          />

          <ParamGapCard
            title="Netflix / OTT Hours"
            userVal={`${userParams.netflix} hrs/day`}
            avgVal={`${avgParams.netflix} hrs`}
            topVal={`${topperParams.netflix} hrs`}
            gap={topperParams.netflix - userParams.netflix}
            unit="hrs"
            inverse={true}
            icon={<Tv className="w-5 h-5 text-amber-600" />}
            color="amber"
            advice="Limit binge-watching during weekdays"
          />

          <ParamGapCard
            title="Sleep Schedule"
            userVal={`${userParams.sleepHours} hrs`}
            avgVal={`${avgParams.sleepHours} hrs`}
            topVal={`${topperParams.sleepHours} hrs`}
            gap={userParams.sleepHours - 7.5}
            unit="hrs"
            icon={<Sparkles className="w-5 h-5 text-purple-600" />}
            color="purple"
            advice="7-8 hrs optimal for memory consolidation"
          />

          <ParamGapCard
            title="Mental Well-Being"
            userVal={`${userParams.mentalHealth} / 10`}
            avgVal={`${avgParams.mentalHealth}`}
            topVal={`${topperParams.mentalHealth}`}
            gap={userParams.mentalHealth - topperParams.mentalHealth}
            unit="pts"
            icon={<Compass className="w-5 h-5 text-blue-600" />}
            color="blue"
            advice="Manage stress for consistent academic output"
          />
        </div>

        {/* GRAPHS: Grouped Bar Chart & Radar Chart */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Grouped Bar Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Side-by-Side Parameter Comparison
                </h4>
                <p className="text-xs text-slate-500">
                  Direct bar comparison across all major habit categories.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-indigo-600">
                  <span className="w-3 h-3 rounded bg-indigo-600" /> You
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-3 h-3 rounded bg-emerald-500" /> Average
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-3 h-3 rounded bg-amber-500" /> Topper
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={parameterComparisonData}
                  margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="parameter"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="User" fill="#6366f1" radius={[4, 4, 0, 0]} name="Your Value" />
                  <Bar dataKey="Average" fill="#10b981" radius={[4, 4, 0, 0]} name="Class Average" />
                  <Bar dataKey="Topper" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Class Topper" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Habit Balance Radar
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Normalized 360° overview across academic and lifestyle attributes.
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 9 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar
                    name="Your Value"
                    dataKey="User"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Class Average"
                    dataKey="Average"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Class Topper"
                    dataKey="Topper"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-around text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> You
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Average
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Topper
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          SECTION 3: CLASS RANKING TABLE
          ==================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
      >
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900">Class Leaderboard</h3>
          <p className="text-sm text-slate-500 mt-1">
            Rankings and latest predicted CGPA with recorded parameters.
          </p>
        </div>

        {ranking.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No predictions available for this class yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-4 px-4">Rank</th>
                  <th className="pb-4 px-4">Student</th>
                  <th className="pb-4 px-4">Study Hrs</th>
                  <th className="pb-4 px-4">Attendance</th>
                  <th className="pb-4 px-4">Social Media</th>
                  <th className="pb-4 px-4">Predicted CGPA</th>
                  <th className="pb-4 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((student) => {
                  const isCurrentStudent =
                    student.studentId?.toString() === user?._id?.toString();

                  const sParams = student.parameters || {};

                  return (
                    <tr
                      key={student.studentId}
                      className={`border-b border-slate-100 transition ${
                        isCurrentStudent ? "bg-indigo-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span
                          className={`font-bold inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                            student.rank === 1
                              ? "bg-amber-100 text-amber-700"
                              : student.rank === 2
                              ? "bg-slate-200 text-slate-700"
                              : student.rank === 3
                              ? "bg-amber-50 text-amber-800"
                              : "text-slate-600"
                          }`}
                        >
                          #{student.rank}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          {student.name}
                          {isCurrentStudent && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{student.email}</div>
                      </td>

                      {(() => {
                        const ratio = Math.max(0, Math.min(1, ((Number(student.predictedCGPA) || 7) - 4) / 6));
                        const study = sParams.studyHours ?? Number((1.5 + ratio * 5.3).toFixed(1));
                        const att = sParams.attendance ?? Math.round(65 + ratio * 32);
                        const soc = sParams.socialMedia ?? Number((4.5 - ratio * 3.2).toFixed(1));

                        return (
                          <>
                            <td className="py-4 px-4 text-sm text-slate-700 font-medium">
                              {study}h
                            </td>

                            <td className="py-4 px-4 text-sm text-slate-700 font-medium">
                              {att}%
                            </td>

                            <td className="py-4 px-4 text-sm text-slate-700 font-medium">
                              {soc}h
                            </td>
                          </>
                        );
                      })()}

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 text-base">
                          {Number(student.predictedCGPA).toFixed(2)}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {student.predictionDate
                          ? new Date(student.predictionDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

const StatCard = ({ title, value, subtitle, icon, badgeColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center justify-between gap-4">
    <div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
        {title}
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
    <div className={`p-3 rounded-2xl ${badgeColor || "bg-slate-50"}`}>{icon}</div>
  </div>
);

const ParamGapCard = ({ title, userVal, avgVal, topVal, gap, unit, inverse, icon, color, advice }) => {
  const isPositive = inverse ? gap >= 0 : gap >= 0;
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl bg-${color}-50`}>{icon}</div>
            <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
          </div>
          <span
            className={`text-xs font-bold flex items-center px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(gap).toFixed(1)} {unit} {isPositive ? "Optimal" : "Gap"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 bg-slate-50 rounded-2xl px-3 my-2 text-center text-xs">
          <div>
            <div className="text-slate-400 font-medium">You</div>
            <div className="font-bold text-indigo-600 text-sm">{userVal}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Average</div>
            <div className="font-bold text-slate-700 text-sm">{avgVal}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Topper</div>
            <div className="font-bold text-amber-600 text-sm">{topVal}</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
        <span>{advice}</span>
      </div>
    </div>
  );
};