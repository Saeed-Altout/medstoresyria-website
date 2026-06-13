"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  getMe,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import type {
  ApiResponse,
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from "@/types";

const errMessage = (err: AxiosError) =>
  (err.response?.data as ApiResponse<null> | undefined)?.message ??
  "Something went wrong";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation<AuthResponse, AxiosError, LoginDto>({
    mutationFn: loginApi,
    onSuccess: ({ user, accessToken }) => setAuth(user, accessToken),
    onError: (err) => toast.error(errMessage(err)),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation<AuthResponse, AxiosError, RegisterDto>({
    mutationFn: registerApi,
    onSuccess: ({ user, accessToken }) => setAuth(user, accessToken),
    onError: (err) => toast.error(errMessage(err)),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  return useMutation<unknown, AxiosError, void>({
    mutationFn: logoutApi,
    onSettled: () => {
      logout();
      qc.clear();
    },
  });
}

/** Fetches the live profile; keeps the auth store user in sync. */
export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery<User, AxiosError>({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getMe();
      setUser(user);
      return user;
    },
    enabled: !!accessToken,
  });
}
