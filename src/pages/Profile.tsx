import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [profileImg, setProfileImg] = useState(
    user?.profile_img || "/profile.jpg"
  );

  useEffect(() => {
    if (user?.profile_img) {
      setProfileImg(user.profile_img);
    }
  }, [user?.profile_img]);

  if (!user)
    return (
      <p className="text-center text-white">
        사용자 정보를 불러올 수 없습니다.
      </p>
    );
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃 되었습니다. 👋");
      navigate("/");
    } catch (error) {
      toast.error("로그아웃에 실패했습니다.");
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black text-white min-h-screen">
      <div className="relative mt-12">
        <img
          alt="Profile"
          className="h-40 w-40 rounded-full border-4 border-gray-300 cursor-pointer hover:opacity-80 transition"
          src={profileImg}
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative">
            <img
              src={profileImg}
              alt="Profile Large"
              className="h-72 w-72 rounded-full border-4 border-white"
            />
            <button
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-500 text-white text-2xl rounded-full px-3 py-1"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-3xl font-bold neon-text">
          Nickname: {user.nickname}
        </p>
        <p className="text-lg text-gray-400 mt-2">
          Introduction:{" "}
          {user.introduction || "No bio yet. Tell the world who you are!"}
        </p>
      </div>

      <div className="mt-8 flex flex-col space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate("/profile-edit")}
          className="px-6 py-3 text-lg font-semibold rounded-xl bg-[#0DA34E] text-black hover:bg-[#10c855] transition-all duration-300"
        >
          Let's Glow Up ✨
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-3 text-lg font-semibold rounded-xl bg-[#8B0000] text-white hover:bg-[#a80000] transition-all duration-300"
        >
          I'm Out 🚪
        </button>
      </div>
    </div>
  );
};

export default Profile;
