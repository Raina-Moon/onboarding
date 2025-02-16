import { supabase } from "../utils/supabaseClient";

export const loginUser = async (email: string, password: string) => {
  const { data: existingUser, error: userCheckError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (userCheckError || !existingUser) {
    throw new Error("유저 정보를 찾을 수 없습니다.");
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes("Email not confirmed")) {
      throw new Error("이메일 인증이 필요합니다. 📧 이메일을 확인해주세요.");
    }
    if (authError.message.includes("Invalid login credentials")) {
      throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
    }
    throw authError;
  }

  return authData;
};

export const registerUser = async (email: string, password: string, nickname: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });

  if (error) throw error;
  return data;
};
