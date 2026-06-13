import apiClient from "./client";
import type { ApiResponse, AuthResponse, LoginDto, RegisterDto, User } from "@/types";

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    dto,
  );
  return data.data;
};

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    dto,
  );
  return data.data;
};

export const logout = (): Promise<unknown> => apiClient.post("/auth/logout");

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
  return data.data;
};

export const refreshToken = async (): Promise<string> => {
  const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>(
    "/auth/refresh",
  );
  return data.data.accessToken;
};

/** Absolute URL to start the Google OAuth flow on the backend. */
export const googleAuthUrl = (): string =>
  `${process.env.NEXT_PUBLIC_API_URL ?? ""}/auth/google`;
