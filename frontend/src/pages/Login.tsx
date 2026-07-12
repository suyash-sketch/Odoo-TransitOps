import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { mockLogin } from "@/lib/mockLogin";
import { useAuthStore } from "@/stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = mockLogin(email.trim(), password);

    if (!result) {
      setError("Invalid credentials");
      setIsSubmitting(false);
      return;
    }

    setUser(result);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                TO
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-800">
                Transit<span style={{ color: "var(--accent)" }}>Ops</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@transitops.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 transition-colors focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 transition-colors focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent)";
              }}
            >
              Sign In
            </button>
          </form>

          {error && (
            <p
              role="alert"
              className="mt-4 text-center text-sm font-medium text-red-600"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
