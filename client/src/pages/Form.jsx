import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Calendar, GraduationCap, Clock, Moon, Send, Loader2, 
  User, Tv, Monitor, HeartPulse, Brain, Briefcase, Utensils, Wifi, Activity
} from "lucide-react";

export default function Form({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Updated state to include ALL 19 parameters needed by the model
  const [formData, setFormData] = useState({
    age: 20,
    studyHours: 5,
    socialMedia: 2,
    netflix: 1,
    attendance: 85,
    sleepHours: 7,
    exercise: 3,
    mentalHealth: 7,
    gender: "Male", // Male, Other, Female
    partTimeJob: "No",
    dietQuality: "Average", // Good, Poor, Average
    parentalEdu: "High School", // High School, Master, Unknown, etc.
    internetQuality: "Average", // Good, Poor, Average
    extracurriculars: "No"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 2. Mapping data to the EXACT 19-column array from your Jupyter Notebook
    // Order: [age, study, social, netflix, attend, sleep, exercise, mental, gender_M, gender_O, job_Y, diet_G, diet_P, edu_HS, edu_M, edu_U, net_G, net_P, extra_Y]
    const featureArray = [
      formData.age,
      formData.studyHours,
      formData.socialMedia,
      formData.netflix,
      formData.attendance,
      formData.sleepHours,
      formData.exercise,
      formData.mentalHealth,
      formData.gender === "Male" ? 1 : 0,
      formData.gender === "Other" ? 1 : 0,
      formData.partTimeJob === "Yes" ? 1 : 0,
      formData.dietQuality === "Good" ? 1 : 0,
      formData.dietQuality === "Poor" ? 1 : 0,
      formData.parentalEdu === "High School" ? 1 : 0,
      formData.parentalEdu === "Master" ? 1 : 0,
      formData.parentalEdu === "Unknown" ? 1 : 0,
      formData.internetQuality === "Good" ? 1 : 0,
      formData.internetQuality === "Poor" ? 1 : 0,
      formData.extracurriculars === "Yes" ? 1 : 0,
    ];

    try {
      const res = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featureArray }),
      });

      const data = await res.json();
      
      // 3. Converting Score (0-100) to CGPA (0-10)
      const predictedCGPA = (data.prediction / 10).toFixed(2);

      sessionStorage.setItem("lastPrediction", JSON.stringify({
        cgpa: predictedCGPA,
        percentage: data.prediction
      }));

      navigate("/prediction");
    } catch (err) {
      console.error("Prediction Error:", err);
      alert("Make sure your Python API is running on port 5001!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Student Habit Analyzer</h2>
        <p className="text-slate-600">Enter your details to calculate your predicted CGPA</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border p-8">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
          
          {/* Numerical Inputs */}
          <InputGroup label="Age" icon={<User/>} value={formData.age} onChange={(v) => setFormData({...formData, age: Number(v)})} min={16} max={50}/>
          <InputGroup label="Study Hours/Day" icon={<Clock/>} value={formData.studyHours} onChange={(v) => setFormData({...formData, studyHours: Number(v)})} min={0} max={24}/>
          <InputGroup label="Attendance %" icon={<Calendar/>} value={formData.attendance} onChange={(v) => setFormData({...formData, attendance: Number(v)})} min={0} max={100}/>
          <InputGroup label="Social Media Hrs" icon={<Activity/>} value={formData.socialMedia} onChange={(v) => setFormData({...formData, socialMedia: Number(v)})} min={0} max={24}/>
          <InputGroup label="Netflix Hrs" icon={<Tv/>} value={formData.netflix} onChange={(v) => setFormData({...formData, netflix: Number(v)})} min={0} max={24}/>
          <InputGroup label="Sleep Hours" icon={<Moon/>} value={formData.sleepHours} onChange={(v) => setFormData({...formData, sleepHours: Number(v)})} min={0} max={24}/>
          <InputGroup label="Exercise/Week" icon={<HeartPulse/>} value={formData.exercise} onChange={(v) => setFormData({...formData, exercise: Number(v)})} min={0} max={7}/>
          <InputGroup label="Mental Health (1-10)" icon={<Brain/>} value={formData.mentalHealth} onChange={(v) => setFormData({...formData, mentalHealth: Number(v)})} min={1} max={10}/>

          {/* Categorical Dropdowns (The One-Hot Encoding parts) */}
          <SelectGroup label="Gender" icon={<User/>} options={["Male", "Female", "Other"]} value={formData.gender} onChange={(v) => setFormData({...formData, gender: v})}/>
          <SelectGroup label="Part Time Job?" icon={<Briefcase/>} options={["No", "Yes"]} value={formData.partTimeJob} onChange={(v) => setFormData({...formData, partTimeJob: v})}/>
          <SelectGroup label="Diet Quality" icon={<Utensils/>} options={["Average", "Good", "Poor"]} value={formData.dietQuality} onChange={(v) => setFormData({...formData, dietQuality: v})}/>
          <SelectGroup label="Parental Education" icon={<GraduationCap/>} options={["High School", "Bachelor", "Master", "Unknown"]} value={formData.parentalEdu} onChange={(v) => setFormData({...formData, parentalEdu: v})}/>
          <SelectGroup label="Internet Quality" icon={<Wifi/>} options={["Average", "Good", "Poor"]} value={formData.internetQuality} onChange={(v) => setFormData({...formData, internetQuality: v})}/>
          <SelectGroup label="Extracurriculars?" icon={<BookOpen/>} options={["No", "Yes"]} value={formData.extracurriculars} onChange={(v) => setFormData({...formData, extracurriculars: v})}/>

          <div className="md:col-span-3 pt-6">
            <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-xl font-bold flex justify-center gap-3 hover:bg-indigo-700 transition">
              {loading ? <Loader2 className="animate-spin" /> : <>Calculate My CGPA <Send className="w-5 h-5" /></>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const InputGroup = ({ label, icon, value, onChange, min, max }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">{icon}{label}</label>
    <input type="number" required min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
  </div>
);

const SelectGroup = ({ label, icon, options, value, onChange }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">{icon}{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);