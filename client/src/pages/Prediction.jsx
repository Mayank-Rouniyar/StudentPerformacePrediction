import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function Prediction() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("lastPrediction");
    if (savedData) {
      setResult(JSON.parse(savedData));
    } else {
      navigate("/form");
    }
  }, [navigate]);

  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-screen flex flex-col items-center">
      <button 
        onClick={() => navigate("/form")} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Entry
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-block p-4 bg-indigo-50 rounded-2xl mb-6">
          <GraduationCap className="w-10 h-10 text-indigo-600" />
        </div>
        
        <h1 className="text-slate-500 font-medium uppercase tracking-widest text-sm mb-2">
          Predicted Result
        </h1>
        
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-9xl font-black text-slate-900 tracking-tighter">
            {result.cgpa}
          </span>
          <span className="text-3xl font-bold text-slate-300">/ 10.0</span>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-slate-400 text-sm">
            Based on a raw score of {result.percentage}%
          </p>
        </div>
      </motion.div>
    </div>
  );
}