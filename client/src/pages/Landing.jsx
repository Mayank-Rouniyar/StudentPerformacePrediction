import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp, Award, ShieldCheck, Zap } from "lucide-react";

export default function Landing({ user }) {
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) navigate("/form");
    else navigate("/auth");
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 mb-8">
                <Zap className="w-4 h-4 mr-2" />
                Next-Gen Student Analytics
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                Predict Your Academic <br />
                <span className="text-indigo-600">Success with Precision</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10">
                EduPredict AI uses advanced analytics to help students understand their performance patterns, 
                predict future outcomes, and receive personalized advice.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleStart}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                >
                  Start Prediction
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/analysis")}
                  className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  View Rank Analysis
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-300 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-indigo-600" />}
              title="Performance Prediction"
              description="Get accurate estimates of your future grades based on your current study habits and attendance."
            />
            <FeatureCard 
              icon={<Award className="w-8 h-8 text-emerald-600" />}
              title="Rank Analysis"
              description="Understand where you stand compared to historical benchmarks and peer performance data."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-amber-600" />}
              title="Personalized Advice"
              description="Receive actionable insights on how to improve your focus areas and optimize your study schedule."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all"
  >
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);
