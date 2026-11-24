
import React, { useState } from "react";
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
  User,
  Tv,
  HeartPulse,
  Brain,
  Briefcase,
  Utensils,
  Wifi,
  Activity,
} from "lucide-react";

export default function Form({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: 20,
    studyHours: 5,
    socialMedia: 2,
    netflix: 1,
    attendance: 85,
    sleepHours: 7,
    exercise: 3,
    mentalHealth: 7,
    gender: "Male",
    partTimeJob: "No",
    dietQuality: "Average",
    parentalEdu: "High School",
    internetQuality: "Average",
    extracurriculars: "No",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert form data into the exact feature order
    // expected by the Python ML model
    const featureArray = [
      formData.age,
      formData.studyHours,
      formData.socialMedia,
      formData.netflix,
      formData.attendance,
      formData.sleepHours,
      formData.exercise,
      formData.mentalHealth,

      // Gender
      formData.gender === "Male" ? 1 : 0,
      formData.gender === "Other" ? 1 : 0,

      // Part-time job
      formData.partTimeJob === "Yes" ? 1 : 0,

      // Diet quality
      formData.dietQuality === "Good" ? 1 : 0,
      formData.dietQuality === "Poor" ? 1 : 0,

      // Parental education
      formData.parentalEdu === "High School" ? 1 : 0,
      formData.parentalEdu === "Master" ? 1 : 0,
      formData.parentalEdu === "Unknown" ? 1 : 0,

      // Internet quality
      formData.internetQuality === "Good" ? 1 : 0,
      formData.internetQuality === "Poor" ? 1 : 0,

      // Extracurricular activities
      formData.extracurriculars === "Yes" ? 1 : 0,
    ];

    try {
      /* =====================================================
         STEP 1: SEND DATA TO PYTHON ML API
         ===================================================== */

      const predictionResponse = await fetch(
        "http://localhost:5001/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: featureArray,
          }),
        }
      );

      const predictionData = await predictionResponse.json();

      if (!predictionResponse.ok || predictionData.status !== "success") {
        throw new Error(
          predictionData.message || "Prediction failed"
        );
      }

      const predictedCGPA = (
        predictionData.prediction / 10
      ).toFixed(2);

      /* =====================================================
         STEP 2: CHECK USER INFORMATION
         ===================================================== */

      if (!user?._id || !user?.classId) {
        throw new Error(
          "User information is missing. Please login again."
        );
      }

      /* =====================================================
         STEP 3: SAVE PREDICTION TO NODE + MONGODB
         ===================================================== */

      const saveResponse = await fetch(
        "http://localhost:8000/api/predictions/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student: user._id,
            classId: user.classId,
            predictedCGPA: Number(predictedCGPA),
            parameters: formData,
          }),
        }
      );

      const saveData = await saveResponse.json();

      if (!saveResponse.ok || !saveData.success) {
        throw new Error(
          saveData.message || "Failed to save prediction"
        );
      }

      /* =====================================================
         STEP 4: SAVE LATEST RESULT FOR PREDICTION PAGE
         ===================================================== */

      sessionStorage.setItem(
        "lastPrediction",
        JSON.stringify({
          cgpa: predictedCGPA,
          percentage: predictionData.prediction,
          parameters: formData,
        })
      );

      /* =====================================================
         STEP 5: GO TO PREDICTION PAGE
         ===================================================== */

      navigate("/prediction");
    } catch (err) {
      console.error("Prediction Error:", err);

      alert(
        err.message ||
          "Something went wrong while generating prediction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Student Habit Analyzer
        </h2>

        <p className="text-slate-600">
          Enter your details to calculate your predicted CGPA
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border p-8"
      >
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-6"
        >
          <InputGroup
            label="Age"
            icon={<User />}
            value={formData.age}
            onChange={(v) =>
              setFormData({
                ...formData,
                age: Number(v),
              })
            }
            min={16}
            max={50}
          />

          <InputGroup
            label="Study Hours/Day"
            icon={<Clock />}
            value={formData.studyHours}
            onChange={(v) =>
              setFormData({
                ...formData,
                studyHours: Number(v),
              })
            }
            min={0}
            max={24}
          />

          <InputGroup
            label="Attendance %"
            icon={<Calendar />}
            value={formData.attendance}
            onChange={(v) =>
              setFormData({
                ...formData,
                attendance: Number(v),
              })
            }
            min={0}
            max={100}
          />

          <InputGroup
            label="Social Media Hrs"
            icon={<Activity />}
            value={formData.socialMedia}
            onChange={(v) =>
              setFormData({
                ...formData,
                socialMedia: Number(v),
              })
            }
            min={0}
            max={24}
          />

          <InputGroup
            label="Netflix Hrs"
            icon={<Tv />}
            value={formData.netflix}
            onChange={(v) =>
              setFormData({
                ...formData,
                netflix: Number(v),
              })
            }
            min={0}
            max={24}
          />

          <InputGroup
            label="Sleep Hours"
            icon={<Moon />}
            value={formData.sleepHours}
            onChange={(v) =>
              setFormData({
                ...formData,
                sleepHours: Number(v),
              })
            }
            min={0}
            max={24}
          />

          <InputGroup
            label="Exercise/Week"
            icon={<HeartPulse />}
            value={formData.exercise}
            onChange={(v) =>
              setFormData({
                ...formData,
                exercise: Number(v),
              })
            }
            min={0}
            max={7}
          />

          <InputGroup
            label="Mental Health (1-10)"
            icon={<Brain />}
            value={formData.mentalHealth}
            onChange={(v) =>
              setFormData({
                ...formData,
                mentalHealth: Number(v),
              })
            }
            min={1}
            max={10}
          />

          <SelectGroup
            label="Gender"
            icon={<User />}
            options={["Male", "Female", "Other"]}
            value={formData.gender}
            onChange={(v) =>
              setFormData({
                ...formData,
                gender: v,
              })
            }
          />

          <SelectGroup
            label="Part Time Job?"
            icon={<Briefcase />}
            options={["No", "Yes"]}
            value={formData.partTimeJob}
            onChange={(v) =>
              setFormData({
                ...formData,
                partTimeJob: v,
              })
            }
          />

          <SelectGroup
            label="Diet Quality"
            icon={<Utensils />}
            options={["Average", "Good", "Poor"]}
            value={formData.dietQuality}
            onChange={(v) =>
              setFormData({
                ...formData,
                dietQuality: v,
              })
            }
          />

          <SelectGroup
            label="Parental Education"
            icon={<GraduationCap />}
            options={[
              "High School",
              "Bachelor",
              "Master",
              "Unknown",
            ]}
            value={formData.parentalEdu}
            onChange={(v) =>
              setFormData({
                ...formData,
                parentalEdu: v,
              })
            }
          />

          <SelectGroup
            label="Internet Quality"
            icon={<Wifi />}
            options={["Average", "Good", "Poor"]}
            value={formData.internetQuality}
            onChange={(v) =>
              setFormData({
                ...formData,
                internetQuality: v,
              })
            }
          />

          <SelectGroup
            label="Extracurriculars?"
            icon={<BookOpen />}
            options={["No", "Yes"]}
            value={formData.extracurriculars}
            onChange={(v) =>
              setFormData({
                ...formData,
                extracurriculars: v,
              })
            }
          />

          <div className="md:col-span-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-xl font-bold flex justify-center gap-3 hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  Calculate My CGPA
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

/* =========================================================
   INPUT COMPONENT
   ========================================================= */

const InputGroup = ({
  label,
  icon,
  value,
  onChange,
  min,
  max,
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
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
    />
  </div>
);

/* =========================================================
   SELECT COMPONENT
   ========================================================= */

const SelectGroup = ({
  label,
  icon,
  options,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
      {icon}
      {label}
    </label>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
