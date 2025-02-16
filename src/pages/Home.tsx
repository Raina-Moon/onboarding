import React from "react";

const Home = () => {
  const date = new Date();
  const month = date.toLocaleString("en-us", { month: "long" });
  const day = date.getDate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-[10rem] font-bold text-[#0DA34E] animate-scaleUp">{month}</h1>
      <p className="text-[6rem] text-[#0DA34E] animate-scaleUp">'{day}</p>
    </div>
  );
};

export default Home;
