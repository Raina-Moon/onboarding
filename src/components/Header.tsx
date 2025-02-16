import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  return (
    <header className="sticky top-0 flex justify-between items-center p-4 bg-black border-b border-gray-400">
      <Link to="/">
        <img src="/logo.png" alt="Website Logo" className="h-15" />
      </Link>

      {user ? (
        <Link to="/profile" className="text-xl text-white font-semibold hover:text-[#0DA34E] transition">
          Hey, {user.nickname} 👋
        </Link>
      ) : (
        <Link to="/login" className="text-2xl text-gray-300 font-semibold pr-5 hover:text-white transition">
          Log In
        </Link>
      )}
    </header>
  );
};

export default Header;
