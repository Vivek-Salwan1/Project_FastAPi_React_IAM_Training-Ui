import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { backend_url } from "../config";
import { getErrorMessage } from "../utils/errors";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const emptyRegister = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const emptyLogin = {
  email: "",
  password: "",
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/login" ? "login" : "register"
  );
  const [isFlipping, setIsFlipping] = useState(false);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRegister = activeTab === "register";

  const handleTabChange = (tab) => {
    if (tab === activeTab || isFlipping) return;

    setIsFlipping(true);
    setError("");
    setFieldErrors({});

    setTimeout(() => {
      setActiveTab(tab);
      setIsFlipping(false);
    }, 180);
  };

  const currentErrors = useMemo(() => fieldErrors, [fieldErrors]);

  const validateRegister = () => {
    const nextErrors = {};
    const name = registerForm.name.trim();
    const email = registerForm.email.trim();
    const { password, confirmPassword } = registerForm;

    if (!name) nextErrors.name = "Full name is required.";
    if (!email) nextErrors.email = "Email is required.";
    else if (!validateEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (!confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";

    return nextErrors;
  };

  const validateLogin = () => {
    const nextErrors = {};
    const email = loginForm.email.trim();
    const { password } = loginForm;

    if (!email) nextErrors.email = "Email is required.";
    else if (!validateEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const nextErrors = isRegister ? validateRegister() : validateLogin();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      if (isRegister) {
        const { data } = await axios.post(`${backend_url}/register`, {
          name: registerForm.name.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
        });
        const registeredEmail = registerForm.email.trim();
        setRegisterForm(emptyRegister);
        setSuccess(data?.message || "Account created. You can now sign in.");
        setLoginForm((prev) => ({ ...prev, email: registeredEmail, password: "" }));
        setActiveTab("login");
      } else {
        const { data } = await axios.post(`${backend_url}/login`, {
          email: loginForm.email.trim(),
          password: loginForm.password,
        });
        if (!data?.access_token) {
          throw new Error("Login succeeded but no access token was returned.");
        }
        localStorage.setItem("access_token", data.access_token);
        setSuccess("Signed in successfully.");
        navigate("/products");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-2xl text-white shadow-md shadow-indigo-200">
            📦
          </Link>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Product<span className="text-indigo-600">Hub</span>
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your products with ease.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="grid grid-cols-2 border-b border-slate-200 p-2">
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`rounded-lg py-3 text-sm font-semibold transition-all duration-200 ${
                isRegister
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`rounded-lg py-3 text-sm font-semibold transition-all duration-200 ${
                !isRegister
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Login
            </button>
          </div>

          <div
            className={`p-6 transition-all duration-200 sm:p-8 ${
              isFlipping ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                {isRegister ? "Create an account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isRegister
                  ? "Enter your details to get started."
                  : "Enter your credentials to access your account."}
              </p>
            </div>

            {success ? (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form key={activeTab} onSubmit={handleSubmit} className="space-y-5" noValidate>
              {isRegister && (
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={registerForm.name}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={inputClass}
                  />
                  {currentErrors.name ? (
                    <p className="mt-1.5 text-xs text-red-600">{currentErrors.name}</p>
                  ) : null}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={isRegister ? registerForm.email : loginForm.email}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (isRegister) {
                      setRegisterForm((prev) => ({ ...prev, email: value }));
                    } else {
                      setLoginForm((prev) => ({ ...prev, email: value }));
                    }
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                />
                {currentErrors.email ? (
                  <p className="mt-1.5 text-xs text-red-600">{currentErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={isRegister ? registerForm.password : loginForm.password}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (isRegister) {
                      setRegisterForm((prev) => ({ ...prev, password: value }));
                    } else {
                      setLoginForm((prev) => ({ ...prev, password: value }));
                    }
                  }}
                  placeholder="Enter your password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className={inputClass}
                />
                {currentErrors.password ? (
                  <p className="mt-1.5 text-xs text-red-600">{currentErrors.password}</p>
                ) : null}
              </div>

              {isRegister && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={inputClass}
                  />
                  {currentErrors.confirmPassword ? (
                    <p className="mt-1.5 text-xs text-red-600">{currentErrors.confirmPassword}</p>
                  ) : null}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? isRegister
                    ? "Creating account..."
                    : "Signing in..."
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
                {!submitting ? <span aria-hidden="true">→</span> : null}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => handleTabChange(isRegister ? "login" : "register")}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ProductHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
