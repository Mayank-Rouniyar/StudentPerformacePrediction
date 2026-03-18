import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">EduPredict</h1>

      <div className="flex gap-4">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/form" className={linkClass("/form")}>Form</Link>
        <Link to="/analysis" className={linkClass("/analysis")}>Analysis</Link>
        <Link to="/advice" className={linkClass("/advice")}>Advice</Link>
      </div>
    </div>
  );
}