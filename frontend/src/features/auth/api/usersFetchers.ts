import {User} from "../types/auth.types.ts";
import axiosClient from "../../../common/api/axiosClient.ts";

export const getMe = async (signal?: AbortSignal): Promise<User> => {
   const res = await axiosClient.get("/auth/user/", { signal })
   return res.data.result;
}