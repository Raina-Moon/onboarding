import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("로그인 성공! 🎉");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="w-full max-w-md p-10 bg-transparent border border-white rounded-2xl">
        <h2 className="text-4xl font-extrabold text-center mb-8 tracking-wide neon-text">
          Welcome Back ✨
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-white bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E]"
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-white bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E]"
            required
          />
          <div className="flex justify-center">
          <button className="px-7 py-2 border border-[#0DA34E] rounded-lg bg-[#0DA34E] text-black font-bold hover:bg-white hover:text-black transition-all duration-300">
          let me in
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          아직 회원이 아니신가요?
          <Link
            to="/signup"
            className="text-[#0DA34E] underline hover:text-gray-400 transition-all"
          >
            Join the club
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
