import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Brain,
  Coffee,
} from "lucide-react";

export default function Advice({ user }) {
  const navigate = useNavigate();

 

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
          Personalized Advice
        </h2>
        <p className="text-slate-600">
          Actionable insights based on your performance profile.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AdviceCard
          icon={<Brain className="w-8 h-8 text-indigo-600" />}
          title="Cognitive Optimization"
          advice="Sleep 7–8 hours daily to improve memory and retention."
          type="success"
        />

        <AdviceCard
          icon={<BookOpen className="w-8 h-8 text-emerald-600" />}
          title="Study Technique"
          advice="Use Pomodoro: 25 min study + 5 min break."
          type="info"
        />

        <AdviceCard
          icon={<Coffee className="w-8 h-8 text-amber-600" />}
          title="Energy Management"
          advice="Do hard subjects in morning, light work later."
          type="warning"
        />
      </div>

      <div className="mt-16 bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-6">Weekly Focus Goal</h3>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-indigo-600 p-8 rounded-3xl text-center min-w-[200px]">
              <div className="text-5xl font-black mb-2">85%</div>
              <div className="text-indigo-200 text-sm font-bold uppercase">
                Target Attendance
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-300 text-lg">
                Focus on attending all lectures this week. Attendance directly boosts performance.
              </p>

              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-2 bg-slate-800 rounded-full text-sm border border-slate-700">
                  #Consistency
                </span>
                <span className="px-4 py-2 bg-slate-800 rounded-full text-sm border border-slate-700">
                  #Growth
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