import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegister } from "../hooks/useRegister";
import Button from "../components/Button";

const Signup = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const validateEmail = (email: string) => {
    return email.includes("@");
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };
  //   setEmail(value);

  //   if (!validateEmail(value)) {
  //     setEmailError("유효한 이메일 주소를 입력해주세요.");
  //   } else {
  //     setEmailError("");
  //   }
  // };

  // const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setPassword(value);

  //   if (!validatePassword(value)) {
  //     setPasswordError(
  //       "비밀번호는 최소 6자 이상, 특수문자 1개, 숫자 1개가 포함되어야 합니다."
  //     );
  //   } else {
  //     setPasswordError("");
  //   }
  // };

  // const handlePasswordConfirmChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const value = e.target.value;
  //   setPasswordConfirm(value);

  //   if (value !== password) {
  //     setPasswordMatchError("비밀번호가 일치하지 않습니다.");
  //   } else {
  //     setPasswordMatchError("");
  //   }
  // };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      validateEmail(value) ? "" : "유효한 이메일 주소를 입력해주세요."
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(
      validatePassword(value)
        ? ""
        : "비밀번호는 최소 6자 이상, 특수문자 1개, 숫자 1개가 포함되어야 합니다."
    );
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    setPasswordMatchError(
      value === password ? "" : "비밀번호가 일치하지 않습니다."
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "비밀번호는 최소 6자 이상, 특수문자 1개, 숫자 1개가 포함되어야 합니다."
      );
      isValid = false;
    }

    if (password !== passwordConfirm) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      await registerMutation.mutateAsync({ email, password, nickname });
      toast.success("회원가입 성공! 이메일을 확인하여 인증을 완료하세요. 📧");
      toast.info("이메일을 확인한 후 로그인해 주세요.");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error instanceof Error ? error.message : "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 bg-opacity-10 backdrop-blur-md border border-white rounded-2xl shadow-lg">
        <h2 className="text-5xl font-extrabold text-center mb-6 tracking-wide neon-text">
          Welcome to the crew 🚀
        </h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-3 border border-white bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E]"
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          <input
            type="text"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border border-white bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E]"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-white bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}

          <div className="relative">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="confirm password"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              className="w-full p-3 border border-white bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
            >
              {showPasswordConfirm ? "🙈" : "👁️"}
            </button>
          </div>
          {passwordMatchError && (
            <p className="text-red-500 text-sm">{passwordMatchError}</p>
          )}

          <div className="flex justify-center">
            <Button type="submit">sign me up</Button>
          </div>
        </form>
        <p className="mt-6 text-center">
          이미 회원이신가요?
          <Link
            to="/login"
            className="text-[#0DA34E] underline hover:text-gray-400 transition-all"
          >
            log me in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
