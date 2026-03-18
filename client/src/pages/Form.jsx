import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Clock,
  Moon,
  Send,
  Loader2,
} from "lucide-react";

export default function Form({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studyHours: 5,
    attendance: 85,
    previousGrades: 75,
    extracurriculars: 2,
    sleepHours: 7,
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Save data
      await fetch("/api/student/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user?.id, // safer
        }),
      });

      // Get prediction
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const prediction = await res.json();

      sessionStorage.setItem(
        "lastPrediction",
        JSON.stringify(prediction)
      );

      navigate("/prediction");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Input Your Data
        </h2>
        <p className="text-slate-600">
          Fill in your academic and lifestyle details for a precise prediction.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border p-8 md:p-12"
      >
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          
          <InputGroup
            label="Daily Study Hours"
            icon={<Clock className="w-5 h-5 text-indigo-500" />}
            value={formData.studyHours}
            onChange={(v) =>
              setFormData({ ...formData, studyHours: Number(v) })
            }
            min={0}
            max={24}
            help="Average hours per day"
          />

          <InputGroup
            label="Attendance (%)"
            icon={<Calendar className="w-5 h-5 text-emerald-500" />}
            value={formData.attendance}
            onChange={(v) =>
              setFormData({ ...formData, attendance: Number(v) })
            }
            min={0}
            max={100}
          />

          <InputGroup
            label="Previous Grades (%)"
            icon={<GraduationCap className="w-5 h-5 text-amber-500" />}
            value={formData.previousGrades}
            onChange={(v) =>
              setFormData({ ...formData, previousGrades: Number(v) })
            }
            min={0}
            max={100}
          />

          <InputGroup
            label="Extracurriculars"
            icon={<BookOpen className="w-5 h-5 text-violet-500" />}
            value={formData.extracurriculars}
            onChange={(v) =>
              setFormData({ ...formData, extracurriculars: Number(v) })
            }
            min={0}
            max={40}
          />

          <InputGroup
            label="Sleep Hours"
            icon={<Moon className="w-5 h-5 text-blue-500" />}
            value={formData.sleepHours}
            onChange={(v) =>
              setFormData({ ...formData, sleepHours: Number(v) })
            }
            min={0}
            max={24}
          />

          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-xl font-bold flex justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Generate Prediction
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}

/* ================= INPUT ================= */

const InputGroup = ({
  label,
  icon,
  value,
  onChange,
  min,
  max,
  help,
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
      {icon}
      {label}
    </label>

    <input
      type="number"
      required
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border rounded-lg"
    />

    {help && (
      <p className="text-xs text-slate-400">{help}</p>
    )}
  </div>
);