import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Tv,
  Brain,
  Sparkles,
  User,
  Users,
  GraduationCap,
  Loader2,
  Award,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

const API_URL = "http://localhost:8000";

// Parameter definitions with units and display titles
const PARAMETERS = [
  { id: "predictedCGPA", label: "Predicted CGPA", unit: "CGPA", icon: GraduationCap, defaultDir: "desc" },
  { id: "studyHours", label: "Study Hours", unit: "hrs/day", icon: BookOpen, defaultDir: "desc" },
  { id: "attendance", label: "Attendance", unit: "%", icon: CheckCircle2, defaultDir: "desc" },
  { id: "socialMedia", label: "Social Media", unit: "hrs/day", icon: Clock, defaultDir: "asc" },
  { id: "netflix", label: "Netflix / OTT", unit: "hrs/day", icon: Tv, defaultDir: "asc" },
  { id: "sleepHours", label: "Sleep Duration", unit: "hrs", icon: Sparkles, defaultDir: "desc" },
  { id: "mentalHealth", label: "Mental Health", unit: "/10", icon: Brain, defaultDir: "desc" },
  { id: "exercise", label: "Exercise Frequency", unit: "days/wk", icon: Sparkles, defaultDir: "desc" },
];

export default function Rank({ user }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting state: which parameter to rank by, and direction
  const [sortParam, setSortParam] = useState("predictedCGPA");
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc' or 'desc'

  /*
  ====================================================
  FETCH CLASS RANKINGS
  ====================================================
  */
  useEffect(() => {
    const fetchRankingData = async () => {
      if (!user?.classId) {
        setError("Class information missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/predictions/ranking/${user.classId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch class ranking");
        }

        let fetchedRanking = data.ranking || [];

        // Check if current user has parameters in sessionStorage that can supplement
        try {
          const stored = sessionStorage.getItem("lastPrediction");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.parameters) {
              fetchedRanking = fetchedRanking.map((s) => {
                if (s.studentId?.toString() === user._id?.toString() && (!s.parameters || Object.keys(s.parameters).length === 0)) {
                  return { ...s, parameters: parsed.parameters };
                }
                return s;
              });
            }
          }
        } catch (e) {
          console.error("Session storage sync error", e);
        }

        setStudents(fetchedRanking);
      } catch (err) {
        console.error("Rank Fetch Error:", err);
        setError(err.message || "Unable to load student rankings");
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, [user?.classId, user?._id]);

  /*
  ====================================================
  EXTRACT PARAMETER VALUE HELPER
  ====================================================
  */
  const getParamValue = (student, paramId) => {
    if (paramId === "predictedCGPA") {
      return Number(student.predictedCGPA ?? 0);
    }
    const params = student.parameters || {};
    return Number(params[paramId] ?? 0);
  };

  /*
  ====================================================
  DYNAMIC SORTING & RANK RECALCULATION
  ====================================================
  */
  const rankedStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    // Filter by search query (name or email)
    const filtered = students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    });

    // Sort according to selected parameter & direction
    const sorted = [...filtered].sort((a, b) => {
      const valA = getParamValue(a, sortParam);
      const valB = getParamValue(b, sortParam);

      if (sortDirection === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    // Assign dynamic ranks (1 to N) based on current sort order
    return sorted.map((student, index) => ({
      ...student,
      currentRank: index + 1,
    }));
  }, [students, sortParam, sortDirection, searchQuery]);

  /*
  ====================================================
  CURRENT USER STATS IN SELECTED PARAMETER
  ====================================================
  */
  const currentUserStanding = useMemo(() => {
    if (!user?._id) return null;
    const match = rankedStudents.find(
      (s) => s.studentId?.toString() === user._id.toString()
    );
    if (!match) return null;
    return {
      rank: match.currentRank,
      total: rankedStudents.length,
      value: getParamValue(match, sortParam),
    };
  }, [rankedStudents, user?._id, sortParam]);

  /*
  ====================================================
  CLASS BENCHMARK STATS FOR SELECTED PARAMETER
  ====================================================
  */
  const parameterStats = useMemo(() => {
    if (students.length === 0) return { highest: 0, lowest: 0, average: 0 };

    const values = students.map((s) => getParamValue(s, sortParam));
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = (sum / values.length).toFixed(1);

    return { highest, lowest, average };
  }, [students, sortParam]);

  /*
  ====================================================
  TOGGLE SORT HANDLER
  ====================================================
  */
  const handleSortChange = (paramId) => {
    if (sortParam === paramId) {
      // Toggle direction
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortParam(paramId);
      // Pick sensible default direction (e.g. low social media is good, high cgpa is good)
      const found = PARAMETERS.find((p) => p.id === paramId);
      setSortDirection(found ? found.defaultDir : "desc");
    }
  };

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
          <p className="text-slate-600 font-medium">Loading comprehensive student rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to Load Rankings</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const activeParamMeta = PARAMETERS.find((p) => p.id === sortParam) || PARAMETERS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-flex items-center gap-1.5 mb-2">
            <Trophy className="w-3.5 h-3.5 text-indigo-600" />
            Class Leaderboard & Parameter Standings
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-1 mb-2">
            Comprehensive Rankings
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            Rank all students by any parameter — CGPA, study hours, attendance, or screen time — in ascending or descending order.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm"
          />
        </div>
      </div>

      {/* QUICK PARAMETER SELECTOR TABS */}
      <div className="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-md flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 flex items-center gap-1 flex-shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Rank By:
        </span>
        {PARAMETERS.map((param) => {
          const isActive = sortParam === param.id;
          const Icon = param.icon;
          return (
            <button
              key={param.id}
              onClick={() => handleSortChange(param.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 flex-shrink-0 transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{param.label}</span>
              {isActive && (
                <span className="bg-white/20 p-0.5 rounded-md text-[10px]">
                  {sortDirection === "desc" ? "High → Low" : "Low → High"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* STATS STRIP FOR ACTIVE PARAMETER */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Currently Ranked By
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {activeParamMeta.label}
            </div>
            <div className="text-xs font-semibold text-indigo-600 mt-1 flex items-center gap-1">
              {sortDirection === "desc" ? "Descending (High to Low)" : "Ascending (Low to High)"}
            </div>
          </div>
          <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600">
            <activeParamMeta.icon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Class Top Mark
            </div>
            <div className="text-2xl font-black text-amber-600">
              {parameterStats.highest} {activeParamMeta.unit}
            </div>
            <div className="text-xs text-slate-400 mt-1">Maximum recorded</div>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Class Cohort Average
            </div>
            <div className="text-2xl font-black text-emerald-600">
              {parameterStats.average} {activeParamMeta.unit}
            </div>
            <div className="text-xs text-slate-400 mt-1">Mean across all students</div>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Your Standing
            </div>
            <div className="text-2xl font-black text-indigo-600">
              {currentUserStanding ? `#${currentUserStanding.rank} / ${currentUserStanding.total}` : "N/A"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {currentUserStanding ? `Your value: ${currentUserStanding.value} ${activeParamMeta.unit}` : "No test taken"}
            </div>
          </div>
          <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ====================================================
          MAIN RANKINGS TABLE
          ==================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Leaderboard Table
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {rankedStudents.length} Students
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Click any column header to sort all students by that specific metric.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Order:</span>
            <button
              onClick={() => setSortDirection("desc")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                sortDirection === "desc"
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" /> High to Low
            </button>
            <button
              onClick={() => setSortDirection("asc")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                sortDirection === "asc"
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" /> Low to High
            </button>
          </div>
        </div>

        {rankedStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No students found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-5">Rank</th>
                  <th className="py-4 px-5">Student</th>

                  {/* Column 1: Predicted CGPA */}
                  <th
                    onClick={() => handleSortChange("predictedCGPA")}
                    className={`py-4 px-4 cursor-pointer hover:bg-indigo-50/50 transition-colors ${
                      sortParam === "predictedCGPA" ? "text-indigo-600 bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Predicted CGPA</span>
                      {sortParam === "predictedCGPA" && (
                        sortDirection === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>

                  {/* Column 2: Study Hours */}
                  <th
                    onClick={() => handleSortChange("studyHours")}
                    className={`py-4 px-4 cursor-pointer hover:bg-indigo-50/50 transition-colors ${
                      sortParam === "studyHours" ? "text-indigo-600 bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Study Hrs</span>
                      {sortParam === "studyHours" && (
                        sortDirection === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>

                  {/* Column 3: Attendance */}
                  <th
                    onClick={() => handleSortChange("attendance")}
                    className={`py-4 px-4 cursor-pointer hover:bg-indigo-50/50 transition-colors ${
                      sortParam === "attendance" ? "text-indigo-600 bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Attendance</span>
                      {sortParam === "attendance" && (
                        sortDirection === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>

                  {/* Column 4: Social Media */}
                  <th
                    onClick={() => handleSortChange("socialMedia")}
                    className={`py-4 px-4 cursor-pointer hover:bg-indigo-50/50 transition-colors ${
                      sortParam === "socialMedia" ? "text-indigo-600 bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Social Media</span>
                      {sortParam === "socialMedia" && (
                        sortDirection === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>

                  {/* Column 5: Netflix */}
                  <th
                    onClick={() => handleSortChange("netflix")}
                    className={`py-4 px-4 cursor-pointer hover:bg-indigo-50/50 transition-colors ${
                      sortParam === "netflix" ? "text-indigo-600 bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Netflix / TV</span>
                      {sortParam === "netflix" && (
                        sortDirection === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>

                  {/* Column 6: Sleep */}
                  <th
                    onClick={() => handleSortChange("sleepHours")}
                    className={`py-4 px-4 cursor-pointer hover:bg-indigo-50/50 transition-colors ${
                      sortParam === "sleepHours" ? "text-indigo-600 bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Sleep</span>
                      {sortParam === "sleepHours" && (
                        sortDirection === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>

                  {/* Column 7: Mental Health */}
                  <th
                    onClick={() => handleSortChange("mentalHealth")}
                    className={`py-4 px-4 cursor-pointer hover:bg-indigo-50/50 transition-colors ${
                      sortParam === "mentalHealth" ? "text-indigo-600 bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Mental Health</span>
                      {sortParam === "mentalHealth" && (
                        sortDirection === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {rankedStudents.map((student) => {
                  const isCurrent = student.studentId?.toString() === user?._id?.toString();
                  const p = student.parameters || {};

                  return (
                    <tr
                      key={student.studentId}
                      className={`transition-colors ${
                        isCurrent ? "bg-indigo-50/80 font-medium" : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Rank Badge */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-bold text-xs ${
                            student.currentRank === 1
                              ? "bg-amber-100 text-amber-800 shadow-sm border border-amber-200"
                              : student.currentRank === 2
                              ? "bg-slate-200 text-slate-800 shadow-sm border border-slate-300"
                              : student.currentRank === 3
                              ? "bg-amber-50 text-amber-900 border border-amber-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{student.currentRank}
                        </span>
                      </td>

                      {/* Student Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{student.name}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{student.email}</div>
                      </td>

                      {/* Predicted CGPA */}
                      <td className={`py-4 px-4 ${sortParam === "predictedCGPA" ? "bg-indigo-50/30" : ""}`}>
                        <span className="font-extrabold text-slate-900 text-base">
                          {Number(student.predictedCGPA).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">/ 10</span>
                      </td>

                      {/* Study Hours */}
                      <td className={`py-4 px-4 ${sortParam === "studyHours" ? "bg-indigo-50/30 font-bold" : ""}`}>
                        {p.studyHours !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span>{p.studyHours}h</span>
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${Math.min(100, (Number(p.studyHours) / 8) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className={`py-4 px-4 ${sortParam === "attendance" ? "bg-indigo-50/30 font-bold" : ""}`}>
                        {p.attendance !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span>{p.attendance}%</span>
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  Number(p.attendance) >= 85
                                    ? "bg-emerald-500"
                                    : Number(p.attendance) >= 75
                                    ? "bg-blue-500"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${Number(p.attendance)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Social Media */}
                      <td className={`py-4 px-4 ${sortParam === "socialMedia" ? "bg-indigo-50/30 font-bold" : ""}`}>
                        {p.socialMedia !== undefined ? (
                          <span className={Number(p.socialMedia) > 3 ? "text-rose-600 font-semibold" : "text-slate-700"}>
                            {p.socialMedia}h
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Netflix */}
                      <td className={`py-4 px-4 ${sortParam === "netflix" ? "bg-indigo-50/30 font-bold" : ""}`}>
                        {p.netflix !== undefined ? (
                          <span className={Number(p.netflix) > 2 ? "text-amber-600 font-semibold" : "text-slate-700"}>
                            {p.netflix}h
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Sleep */}
                      <td className={`py-4 px-4 ${sortParam === "sleepHours" ? "bg-indigo-50/30 font-bold" : ""}`}>
                        {p.sleepHours !== undefined ? `${p.sleepHours}h` : <span className="text-slate-300">-</span>}
                      </td>

                      {/* Mental Health */}
                      <td className={`py-4 px-4 ${sortParam === "mentalHealth" ? "bg-indigo-50/30 font-bold" : ""}`}>
                        {p.mentalHealth !== undefined ? `${p.mentalHealth} / 10` : <span className="text-slate-300">-</span>}
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
