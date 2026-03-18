import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, Zap, ArrowLeft, RefreshCw, Star } from "lucide-react";

export default function Prediction({ user }) {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate("/form")}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Form
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Result */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <div className="p-8 md:p-12 text-center">
            <div className="inline-flex p-4 bg-indigo-50 rounded-2xl mb-6">
              <Trophy className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-500 mb-2 uppercase tracking-widest">Predicted Performance</h2>
            <div className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter">
              {result.prediction}
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Estimated GPA</div>
                <div className="text-3xl font-black text-indigo-600">{result.estimatedGPA}</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Confidence</div>
                <div className="text-3xl font-black text-emerald-600">{result.confidence}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 p-8 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Key Impact Factors
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-slate-400 text-xs font-bold uppercase">Study Hours Impact</div>
                <div className="text-xl font-medium">{result.factors.studyImpact}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-xs font-bold uppercase">Attendance Impact</div>
                <div className="text-xl font-medium">{result.factors.attendanceImpact}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200"
          >
            <Star className="w-8 h-8 text-amber-300 mb-4" />
            <h3 className="text-xl font-bold mb-2">What this means?</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              This prediction is based on historical data patterns of thousands of students. 
              It estimates your likely outcome if you maintain your current habits.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50"
          >
            <Target className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Next Steps</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                Review your analysis dashboard
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                Check personalized advice
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                Adjust study hours for better results
              </li>
            </ul>
          </motion.div>

          <button 
            onClick={() => navigate("/form")}
            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Prediction
          </button>
        </div>
      </div>
    </div>
  );
}
