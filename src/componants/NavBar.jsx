import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getStoredToken, getTokenPayload } from "../utils/api";

export function Navbar() {
  const navigate = useNavigate();
  const token = getStoredToken();
  const user = getTokenPayload();

  const handleLogout = () => {
    clearToken();
    navigate("/register");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
            📦
          </div>
          <span className="text-xl font-bold tracking-tight">
            Product<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              {user?.name || user?.email ? (
                <span className="hidden max-w-[12rem] truncate text-sm text-slate-500 sm:inline">
                  {user.name || user.email}
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
