import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/authApi";
import { toast } from "react-toastify";

export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ email, password, nickname }: { email: string; password: string; nickname: string }) => {
      return await registerUser(email, password, nickname);
    },
    onSuccess: () => {
      toast.success("회원가입 성공! 이메일을 확인하여 인증을 완료하세요. 📧");
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      toast.error("회원가입에 실패했습니다.");
    },
  });
};
