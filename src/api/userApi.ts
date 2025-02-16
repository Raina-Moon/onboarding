import { supabase } from "../utils/supabaseClient";

// ✅ 유저 정보 가져오기
export const fetchUserInfo = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("유저 정보를 가져올 수 없습니다.");

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email, nickname, profile_img,introduction")
    .eq("email", data.user.email)
    .single();

  if (userError || !userData) throw new Error("유저 정보를 찾을 수 없습니다.");

  return userData;
};

// ✅ 프로필 업데이트
export const updateProfile = async (formData: FormData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // 먼저 현재 사용자 정보 가져오기
  const { data: userData } = await supabase
    .from("users")
    .select("profile_img, nickname, introduction")
    .eq("id", user.id)
    .single();

  let profile_img_url = userData?.profile_img;

  const profileImg = formData.get("profile_img") as File | null;
  const nickname = formData.get("nickname") as string;
  const introduction = formData.get("introduction") as string;

  if (profileImg) {
    const fileExt = profileImg.name.split(".").pop();
    const filePath = `${user.email}/profile.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_img")
      .upload(filePath, profileImg, { cacheControl: "3600", upsert: true });

    if (uploadError) throw uploadError;

    profile_img_url = `${
      import.meta.env.VITE_SUPABASE_URL
    }/storage/v1/object/public/profile_img/${filePath}`;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      profile_img: profile_img_url,
      nickname,
      introduction,
    })
    .eq("id", user.id);

  if (updateError) throw updateError;

  return { profile_img_url };
};
