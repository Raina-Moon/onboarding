import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabaseClient";
import { toast } from "react-toastify";

const updateProfile = async (formData: FormData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const profileImg = formData.get("profile_img") as File | null;
  let profile_img_url = user.user_metadata.profile_img;

  if (profileImg) {
    const fileExt = profileImg.name.split(".").pop();
    const filePath = `${user.email}/profile.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_img")
      .upload(filePath, profileImg, { cacheControl: "3600", upsert: true });

    if (uploadError) throw uploadError;

    profile_img_url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_img/${filePath}`;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ profile_img: profile_img_url })
    .eq("id", user.id);

  if (updateError) throw updateError;

  return { profile_img_url };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      toast.success("프로필 업데이트 완료! 🎉");
    },
    onError: (error) => {
      console.error("프로필 업데이트 실패:", error);
      toast.error("프로필 업데이트에 실패했습니다.");
    },
  });
};
