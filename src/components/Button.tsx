import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ type = "button", onClick, children, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-7 py-2 border border-[#0DA34E] rounded-lg bg-[#0DA34E] text-black font-bold 
        hover:bg-white hover:text-black transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
