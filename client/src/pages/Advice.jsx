import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Brain,
  Coffee,
} from "lucide-react";

export default function Advice() {

  // Static Student Data (simulate ML output)
  const student = {
    predictedCGPA: 7.2,
    studyHours: 2,
    attendance: 68,
    netflixHours: 4,
  };

  const benchmark = {
    studyHours: 4,
    attendance: 85,
    netflixHours: 2,
  };

  // Simulated ML-based advice (based on gaps)
  const adviceData = [
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: "Study Hours Optimization",
      advice: `Current: ${student.studyHours} hrs | Recommended: ${benchmark.studyHours}+ hrs`,
      type: "warning",
    },
    {
      icon: <Brain className="w-8 h-8 text-emerald-600" />,
      title: "Attendance Improvement",
      advice: `Current: ${student.attendance}% | Target: ${benchmark.attendance}%+`,
      type: "warning",
    },
    {
      icon: <Coffee className="w-8 h-8 text-amber-600" />,
      title: "Entertainment Balance",
      advice: `Netflix usage: ${student.netflixHours} hrs | Suggested: < ${benchmark.netflixHours} hrs`,
      type: "info",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
          Performance Recommendations
        </h2>
        <p className="text-slate-600">
          Model-generated insights based on comparative analysis.
        </p>
      </div>

      {/* Advice Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adviceData.map((item, index) => (
          <AdviceCard key={index} {...item} />
        ))}
      </div>

      {/* Prediction Impact Section */}
      <div className="mt-16 bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-6">
            Predicted Outcome Adjustment
          </h3>

          <div className="flex flex-col md:flex-row gap-8 items-center">

            <div className="bg-indigo-600 p-8 rounded-3xl text-center min-w-[200px]">
              <div className="text-5xl font-black mb-2">8.0</div>
              <div className="text-indigo-200 text-sm font-bold uppercase">
                Potential CGPA
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-300 text-lg">
                Based on adjustments in key behavioral parameters, the predicted performance shows an upward trend.
              </p>

              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-2 bg-slate-800 rounded-full text-sm border border-slate-700">
                  #StudyHours
                </span>
                <span className="px-4 py-2 bg-slate-800 rounded-full text-sm border border-slate-700">
                  #Attendance
                </span>
                <span className="px-4 py-2 bg-slate-800 rounded-full text-sm border border-slate-700">
                  #BehavioralData
                </span>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
      </div>

    </div>
  );
}

/* ================= CARD ================= */

const AdviceCard = ({ icon, title, advice, type }) => {
  const colors = {
    success: "bg-emerald-50 border-emerald-100 text-emerald-700",
    info: "bg-indigo-50 border-indigo-100 text-indigo-700",
    warning: "bg-amber-50 border-amber-100 text-amber-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-8 rounded-3xl border shadow-xl"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 mb-6">{advice}</p>

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${colors[type]}`}>
        {type === "success" && <CheckCircle2 className="w-3 h-3" />}
        {type === "warning" && <AlertCircle className="w-3 h-3" />}
        {type === "info" && <Lightbulb className="w-3 h-3" />}
        {type}
      </div>
    </motion.div>
  );
};