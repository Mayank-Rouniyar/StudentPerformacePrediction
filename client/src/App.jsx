import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  LogOut,
  GraduationCap,
  BarChart3,
  ClipboardList,
  Lightbulb,
  Home,
  Trophy,
  Lock,
} from "lucide-react";

// Components
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Form from "./pages/Form";
import Prediction from "./pages/Prediction"; // This will now show your CGPA
import Analysis from "./pages/Analysis";
import Advice from "./pages/Advice";
import Rank from "./pages/Rank";

/* ================= NAVBAR ================= */

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-indigo-600">
              EduPredict AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" active={location.pathname === "/"} icon={<Home className="w-4 h-4" />}>
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink to="/form" active={location.pathname === "/form"} icon={<ClipboardList className="w-4 h-4" />}>
                  Predict CGPA
                </NavLink>
                <NavLink to="/analysis" active={location.pathname === "/analysis"} icon={<BarChart3 className="w-4 h-4" />}>
                  Analysis
                </NavLink>
                <NavLink to="/rank" active={location.pathname === "/rank"} icon={<Trophy className="w-4 h-4" />}>
                  Rankings
                </NavLink>
                <NavLink to="/advice" active={location.pathname === "/advice"} icon={<Lightbulb className="w-4 h-4" />}>
                  Advice
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-6 text-slate-400 text-xs font-semibold">
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition group"
                  title="Sign in required"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  Predict CGPA
                </Link>
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition group"
                  title="Sign in required"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  Analysis
                </Link>
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition group"
                  title="Sign in required"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  Rankings
                </Link>
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition group"
                  title="Sign in required"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  Advice
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <UserCircle className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active, icon }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
      active ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
    }`}
  >
    {icon}
    {children}
  </Link>
);

/* ================= PROTECTED ROUTE ================= */

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

/* ================= APP CONTENT ================= */

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("lastPrediction"); // Clean prediction on logout
    navigate("/"); // Redirect user to Home page immediately on logout
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="pt-16 flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing user={user} />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            
            {/* Protected Routes: Only accessible when logged in */}
            <Route
              path="/form"
              element={
                <ProtectedRoute user={user}>
                  <Form user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prediction"
              element={
                <ProtectedRoute user={user}>
                  <Prediction user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute user={user}>
                  <Analysis user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rank"
              element={
                <ProtectedRoute user={user}>
                  <Rank user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advice"
              element={
                <ProtectedRoute user={user}>
                  <Advice user={user} />
                </ProtectedRoute>
              }
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span className="font-bold">EduPredict AI</span>
        </div>
        <p className="text-sm text-slate-500">
          Data-driven student insights powered by Ensemble Learning.
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}