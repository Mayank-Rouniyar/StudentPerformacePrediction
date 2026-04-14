import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, RefreshCw } from "lucide-react";

export default function PredictionPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("lastPrediction");
    if (savedData) {
      setResult(JSON.parse(savedData));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100"
      >
        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-indigo-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Prediction is Ready!</h1>
        <p className="text-slate-500 mb-8">Based on your lifestyle and study habits.</p>

        <div className="bg-indigo-600 rounded-2xl p-6 mb-8 text-white">
          <span className="text-sm uppercase tracking-widest opacity-80">Predicted CGPA</span>
          <div className="text-6xl font-black mt-1">{result.cgpa}</div>
          <div className="text-xs mt-2 opacity-70">Equivalent to {result.percentage}%</div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate("/")}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Different Data
          </button>
          
          <button 
            onClick={() => navigate("/")}
            className="w-full py-4 text-slate-600 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}