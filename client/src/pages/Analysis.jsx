
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  Users,
  TrendingUp,
  CalendarDays,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:8000";

export default function Analysis({ user }) {
  const [predictions, setPredictions] = useState([]);
  const [ranking, setRanking] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ====================================================
  FETCH CLASS DATA
  ====================================================
  */

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!user?.classId) {
        setError("Class information is missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [historyResponse, rankingResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/api/predictions/class/${user.classId}`
            ),

            fetch(
              `${API_URL}/api/predictions/ranking/${user.classId}`
            ),
          ]);

        const historyData = await historyResponse.json();
        const rankingData = await rankingResponse.json();

        if (!historyResponse.ok || !historyData.success) {
          throw new Error(
            historyData.message ||
              "Failed to fetch prediction history"
          );
        }

        if (!rankingResponse.ok || !rankingData.success) {
          throw new Error(
            rankingData.message ||
              "Failed to fetch class ranking"
          );
        }

        setPredictions(historyData.predictions || []);
        setRanking(rankingData.ranking || []);
      } catch (err) {
        console.error("Analysis Error:", err);

        setError(
          err.message ||
            "Failed to load analysis data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [user?.classId]);


  /*
  ====================================================
  CURRENT STUDENT
  ====================================================
  */

  const currentStudent = useMemo(() => {
    return ranking.find(
      (student) =>
        student.studentId?.toString() ===
        user?._id?.toString()
    );
  }, [ranking, user]);


  /*
  ====================================================
  CLASS AVERAGE
  ====================================================
  */

  const classAverage = useMemo(() => {
    if (ranking.length === 0) return 0;

    const total = ranking.reduce(
      (sum, student) =>
        sum + Number(student.predictedCGPA || 0),
      0
    );

    return (total / ranking.length).toFixed(2);
  }, [ranking]);


  /*
  ====================================================
  HISTORY CHART DATA
  ====================================================
  */

  const historyChartData = useMemo(() => {
    if (predictions.length === 0) {
      return [];
    }

    /*
      Group predictions by date.

      If multiple students make predictions
      on the same date, calculate the class
      average for that date.
    */

    const grouped = {};

    predictions.forEach((prediction) => {
      const date = new Date(
        prediction.predictionDate
      );

      const dateKey = date.toISOString().split("T")[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(
        Number(prediction.predictedCGPA)
      );
    });

    return Object.entries(grouped)
      .map(([date, values]) => {
        const average =
          values.reduce(
            (sum, value) => sum + value,
            0
          ) / values.length;

        return {
          date: new Date(date).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
            }
          ),

          average: Number(average.toFixed(2)),
        };
      })
      .sort(
        (a, b) =>
          new Date(a.date) - new Date(b.date)
      );
  }, [predictions]);


  /*
  ====================================================
  LOADING STATE
  ====================================================
  */

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />

          <p className="text-slate-600 font-medium">
            Loading class analysis...
          </p>
        </div>
      </div>
    );
  }


  /*
  ====================================================
  ERROR STATE
  ====================================================
  */

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Unable to Load Analysis
          </h2>

          <p className="text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }


  /*
  ====================================================
  MAIN UI
  ====================================================
  */

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADER */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
          Student Performance Analysis
        </h2>

        <p className="text-slate-600">
          Compare your predicted CGPA with your class
          and track prediction trends over time.
        </p>
      </div>


      {/* STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        <StatCard
          title="Predicted CGPA"
          value={
            currentStudent
              ? currentStudent.predictedCGPA
              : "N/A"
          }
          icon={
            <BarChart3 className="text-indigo-600" />
          }
        />

        <StatCard
          title="Class Rank"
          value={
            currentStudent
              ? `${currentStudent.rank} / ${ranking.length}`
              : "N/A"
          }
          icon={
            <Users className="text-emerald-600" />
          }
        />

        <StatCard
          title="Class Average"
          value={
            ranking.length > 0
              ? classAverage
              : "N/A"
          }
          icon={
            <TrendingUp className="text-blue-600" />
          }
        />

        <StatCard
          title="Total Students"
          value={ranking.length}
          icon={
            <CalendarDays className="text-amber-600" />
          }
        />

      </div>


      {/* HISTORY GRAPH */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl mb-12"
      >

        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900">
            Class Predicted CGPA Trend
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Average predicted CGPA based on recorded
            predictions.
          </p>
        </div>

        {historyChartData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-slate-500">
            No prediction history available yet.
          </div>
        ) : (
          <div className="h-96 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={historyChartData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                />

                <YAxis
                  domain={[0, 10]}
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Class Average CGPA"
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        )}

      </motion.div>


      {/* CLASS RANKING */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
      >

        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900">
            Class Ranking
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Students ranked according to their latest
            predicted CGPA.
          </p>
        </div>


        {ranking.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No predictions available for this class yet.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">

                  <th className="pb-4 px-4">
                    Rank
                  </th>

                  <th className="pb-4 px-4">
                    Student
                  </th>

                  <th className="pb-4 px-4">
                    Email
                  </th>

                  <th className="pb-4 px-4">
                    Predicted CGPA
                  </th>

                  <th className="pb-4 px-4">
                    Last Prediction
                  </th>

                </tr>
              </thead>


              <tbody>

                {ranking.map((student) => {

                  const isCurrentStudent =
                    student.studentId?.toString() ===
                    user?._id?.toString();

                  return (
                    <tr
                      key={student.studentId}
                      className={`border-b border-slate-100 transition ${
                        isCurrentStudent
                          ? "bg-indigo-50"
                          : "hover:bg-slate-50"
                      }`}
                    >

                      <td className="py-4 px-4">

                        <span
                          className={`font-bold ${
                            student.rank <= 3
                              ? "text-indigo-600"
                              : "text-slate-700"
                          }`}
                        >
                          #{student.rank}
                        </span>

                      </td>


                      <td className="py-4 px-4">

                        <div className="font-semibold text-slate-900">
                          {student.name}

                          {isCurrentStudent && (
                            <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>

                      </td>


                      <td className="py-4 px-4 text-slate-500">
                        {student.email}
                      </td>


                      <td className="py-4 px-4">

                        <span className="font-bold text-slate-900">
                          {Number(
                            student.predictedCGPA
                          ).toFixed(2)}
                        </span>

                      </td>


                      <td className="py-4 px-4 text-slate-500">

                        {student.predictionDate
                          ? new Date(
                              student.predictionDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </motion.div>

    </div>
  );
}


/*
====================================================
STAT CARD
====================================================
*/

const StatCard = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4">

    <div className="p-3 bg-slate-50 rounded-xl">
      {icon}
    </div>

    <div>

      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </div>

      <div className="text-2xl font-black text-slate-900">
        {value}
      </div>

    </div>

  </div>
);
