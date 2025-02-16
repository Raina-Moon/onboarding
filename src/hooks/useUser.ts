import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../api/userApi";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
    enabled: !!localStorage.getItem("accessToken"),
  });
};
