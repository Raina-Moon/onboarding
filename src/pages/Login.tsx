import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import Button from "../components/Button";
import Input from "../components/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="w-full max-w-md p-10 bg-transparent border border-white rounded-2xl">
        <h2 className="text-4xl font-extrabold text-center mb-8 tracking-wide neon-text">
          Welcome Back ✨
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
        <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex justify-center">
            <Button type="submit">let me in</Button>
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
