import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BarChart3, TrendingUp, Users, Activity, Loader2 } from "lucide-react";

export default function Analysis({ user }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetch(`/api/student/data?userId=${user.id}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-6 bg-slate-100 rounded-full mb-6">
          <Activity className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">No Data Found</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          You haven't submitted any performance data yet. Start by entering your details to see your analysis.
        </p>
        <button 
          onClick={() => navigate("/form")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Go to Data Entry
        </button>
      </div>
    );
  }

  const chartData = data.map((d, i) => ({
    name: `Entry ${i + 1}`,
    study: d.studyHours,
    grades: d.previousGrades,
    attendance: d.attendance,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">Performance Analysis</h2>
        <p className="text-slate-600">Visualize your academic trends and behavioral patterns.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Entries" value={data.length} icon={<Activity className="text-blue-600" />} />
        <StatCard title="Avg Study Hours" value={(data.reduce((acc, d) => acc + d.studyHours, 0) / (data.length || 1)).toFixed(1)} icon={<TrendingUp className="text-indigo-600" />} />
        <StatCard title="Avg Attendance" value={(data.reduce((acc, d) => acc + d.attendance, 0) / (data.length || 1)).toFixed(0) + "%"} icon={<Users className="text-emerald-600" />} />
        <StatCard title="Avg Grades" value={(data.reduce((acc, d) => acc + d.previousGrades, 0) / (data.length || 1)).toFixed(1) + "%"} icon={<BarChart3 className="text-amber-600" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Study vs Grades Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-8">Study Hours vs. Grades</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="study" stroke="#6366f1" fillOpacity={1} fill="url(#colorStudy)" strokeWidth={3} />
                <Area type="monotone" dataKey="grades" stroke="#f59e0b" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attendance Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-8">Attendance Consistency</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="attendance" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/30 flex items-center gap-4">
    <div className="p-3 bg-slate-50 rounded-xl">
      {icon}
    </div>
    <div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
    </div>
  </div>
);
