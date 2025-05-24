import axiosClient from "../../../common/api/axiosClient.ts";

export const login = async({ username, password }: { username: string, password: string }): Promise<void> => {
    await axiosClient.post("/auth/jwt/create/", { username, password });
}