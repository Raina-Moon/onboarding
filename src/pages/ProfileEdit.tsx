import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { updateProfile } from "../api/userApi";

const ProfileEdit = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [introduction, setIntroduction] = useState(user?.introduction || "");
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState(user?.profile_img || "/profile.jpg");

  if (!user)
    return <p className="text-center text-white">Failed to load user info.</p>;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("introduction", introduction);
      if (profileImg) {
        formData.append("profile_img", profileImg);
      }
      await updateProfile(formData);
      navigate("/profile");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black text-white h-screen overflow-hidden">
      <h2 className="text-4xl font-bold mb-6 neon-text">Edit Your Vibe 🎨</h2>

      <div className="w-full max-w-lg max-h-[90vh] space-y-6 flex flex-col items-center">
      <div className="relative">
          <label className="cursor-pointer">
            <img
              src={previewImg}
              alt="Profile Preview"
              className="h-32 w-32 rounded-full border-2 border-gray-300 hover:opacity-80 transition"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <p className="text-sm text-gray-400 mt-2">Click to change profile pic</p>
        </div>
        
        <div className="w-full">
          <label className="block text-gray-300 text-lg">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border border-gray-600 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E]"
          />
        </div>

        <div className="w-full">
          <label className="block text-gray-300 text-lg">Introduction</label>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="w-full p-3 border border-gray-600 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0DA34E] h-32 resize-none"
          />
        </div>

        <div className="flex flex-col space-y-4 mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-3 text-lg font-semibold rounded-xl bg-[#0DA34E] text-black hover:bg-[#10c855] transition-all duration-300"
          >
            Save The Glow Up ✨
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-6 py-3 text-lg font-semibold rounded-xl bg-gray-600 text-white hover:bg-gray-500 transition-all duration-300"
          >
            Nevermind 🤷‍♂️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
