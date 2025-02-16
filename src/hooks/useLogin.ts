import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "react-toastify";
import { supabase } from "../utils/supabaseClient";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await loginUser(email, password);
    },
    onSuccess: async (data) => {
      if (!data.user) {
        toast.error("유저 정보를 찾을 수 없습니다.");
        return;
      }
      const supabaseUser = data.user;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("nickname, profile_img, introduction")
        .eq("id", supabaseUser.id)
        .single();

      if (userError || !userData) {
        toast.error("유저 정보를 찾을 수 없습니다.");
        return;
      }

      // ✅ Zustand 상태 업데이트
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        nickname: userData.nickname || "",
        profile_img: userData.profile_img || null,
        introduction: userData.introduction || null,
      });

      // ✅ 로컬스토리지 & 캐싱 처리
      localStorage.setItem("accessToken", data.session?.access_token || "");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });

      toast.success("로그인 성공! 🎉");
    },
    onError: (error: Error) => {
      console.error("로그인 실패:", error);

      // ❌ 이메일/비밀번호 오류 처리
      if (error.message.includes("Invalid login credentials")) {
        toast.error("이메일 또는 비밀번호가 잘못되었습니다.");
      } else if (error.message.includes("User not found")) {
        toast.error("유저 정보를 찾을 수 없습니다.");
      } else {
        toast.error(error.message || "로그인에 실패했습니다.");
      }
    },
  });
};

