import { create } from "zustand";
import { supabase } from "../utils/supabaseClient";
import { toast } from "react-toastify";

interface User {
  id: string;
  email: string;
  nickname: string;
  profile_img: string | null;
  introduction: string | null;
}

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          toast.error("이메일 인증이 필요합니다. 📧 이메일을 확인해주세요.");
          return;
        }
        throw error;
      }

      if (data.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("id, email, nickname, profile_img, introduction")
          .eq("email", data.user.email)
          .single();

        set({
          accessToken: data.session?.access_token || null,
          userId: data.user.id,
          user: userData || null,
          isAuthenticated: true,
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "로그인에 실패했습니다.");
    }
  },

  signup: async (email: string, password: string, nickname: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
          emailRedirectTo: "http://localhost:5173/login",
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: userError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: data.user.email,
            nickname,
            profile_img: null,
            introduction: null,
          },
        ]);

        if (userError) throw userError;
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        accessToken: null,
        userId: null,
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  updateProfile: async (formData: FormData) => {
    try {
      const { user } = useAuth.getState();
      if (!user) throw new Error("User not authenticated");
  
      const profileImg = formData.get("profile_img") as File | null;
      const nickname = formData.get("nickname") as string;
      const introduction = formData.get("introduction") as string;
  
      let profile_img_url = user.profile_img; // 기존 이미지 유지
  
      // ✅ **프로필 이미지 업로드 처리**
      if (profileImg) {
        const fileExt = profileImg.name.split('.').pop();
        const filePath = `${user.email}/profile.${fileExt}`;
  
        // 🔍 **기존 파일 확인 후 삭제**
        const { data: existingFiles, error: checkError } = await supabase
          .storage
          .from("profile_img")
          .list(user.email);
  
        if (checkError) throw checkError;
  
        const existingFile = existingFiles?.find(file => file.name.startsWith("profile"));
  
        if (existingFile) {
          await supabase.storage
            .from("profile_img")
            .remove([`${user.email}/${existingFile.name}`]);
        }
  
        // ⏳ **삭제 후 500ms 대기 (캐싱 문제 방지)**
        await new Promise(resolve => setTimeout(resolve, 500));
  
        // 📂 **새 프로필 이미지 업로드**
        const uploadData = await supabase.storage
          .from("profile_img")
          .upload(filePath, profileImg, { cacheControl: "3600", upsert: true });
  
        if (uploadData.error) throw uploadData.error;
  
        // ✅ **업로드된 이미지의 퍼블릭 URL 가져오기**
        const { data: publicUrlData } = supabase
        .storage
        .from("profile_img")
        .getPublicUrl(filePath);

      profile_img_url = publicUrlData.publicUrl;
    }      
  
      // 🔄 **Supabase DB 업데이트**
      const { error: updateError } = await supabase
        .from("users")
        .update({
          nickname: nickname || user.nickname,
          profile_img: profile_img_url || user.profile_img,
          introduction: introduction || user.introduction,
        })
        .eq("id", user.id);
          
      if (updateError) throw updateError;
  
      // ✅ **Zustand 상태 즉시 업데이트**
      set((state) => ({
        user: {
          ...state.user!,
          nickname: nickname || state.user!.nickname,
          profile_img: profile_img_url || state.user!.profile_img,
          introduction: introduction || state.user!.introduction,
        },
      }));
  
      toast.success("Profile updated successfully! 🎉");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile.");
    }
  }
  
}));
