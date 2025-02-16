import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ type = "text", placeholder, value, onChange, className, error }) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-3 border border-white bg-transparent rounded-lg text-white 
          focus:outline-none focus:ring-2 focus:ring-[#0DA34E] ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
