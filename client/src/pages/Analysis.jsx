import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { BarChart3, Users, Activity, TrendingUp } from "lucide-react";

export default function Analysis() {

  // Static Student Data
  const student = {
    name: "Student A",
    predictedCGPA: 8.4,
    rank: 23, // out of 100
    studyHours: 4,
    netflixHours: 2,
    socialMedia: 3,
    attendance: 85
  };

  // Class Average Data
  const classAvg = {
    predictedCGPA: 7.2,
    studyHours: 3,
    netflixHours: 3,
    socialMedia: 4,
    attendance: 75
  };

  // Chart Data
  const chartData = [
    { name: "Study Hours", student: student.studyHours, average: classAvg.studyHours },
    { name: "Netflix", student: student.netflixHours, average: classAvg.netflixHours },
    { name: "Social Media", student: student.socialMedia, average: classAvg.socialMedia },
    { name: "Attendance", student: student.attendance, average: classAvg.attendance },
    { name: "CGPA", student: student.predictedCGPA, average: classAvg.predictedCGPA }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
          Student Performance Analysis
        </h2>
        <p className="text-slate-600">
          Comparative analysis against a cohort of 100 students.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Predicted CGPA" value={student.predictedCGPA} icon={<BarChart3 className="text-indigo-600" />} />
        <StatCard title="Rank" value={`${student.rank} / 100`} icon={<Users className="text-emerald-600" />} />
        <StatCard title="Study Hours (Daily)" value={`${student.studyHours} hrs`} icon={<TrendingUp className="text-blue-600" />} />
        <StatCard title="Attendance" value={`${student.attendance}%`} icon={<Activity className="text-amber-600" />} />
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-8">
          Student vs Class Average
        </h3>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="student" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="average" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Table Comparison */}
      <div className="mt-12 bg-white p-8 rounded-3xl border border-slate-100 shadow-md">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Parameter Comparison
        </h3>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-500 text-sm">
              <th className="pb-4">Parameter</th>
              <th className="pb-4">Student</th>
              <th className="pb-4">Class Average</th>
            </tr>
          </thead>
          <tbody className="text-slate-800 font-medium">
            <tr className="border-t">
              <td className="py-4">Predicted CGPA</td>
              <td>{student.predictedCGPA}</td>
              <td>{classAvg.predictedCGPA}</td>
            </tr>
            <tr className="border-t">
              <td className="py-4">Study Hours</td>
              <td>{student.studyHours} hrs</td>
              <td>{classAvg.studyHours} hrs</td>
            </tr>
            <tr className="border-t">
              <td className="py-4">Netflix Usage</td>
              <td>{student.netflixHours} hrs</td>
              <td>{classAvg.netflixHours} hrs</td>
            </tr>
            <tr className="border-t">
              <td className="py-4">Social Media</td>
              <td>{student.socialMedia} hrs</td>
              <td>{classAvg.socialMedia} hrs</td>
            </tr>
            <tr className="border-t">
              <td className="py-4">Attendance</td>
              <td>{student.attendance}%</td>
              <td>{classAvg.attendance}%</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4">
    <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
    <div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
    </div>
  </div>
);