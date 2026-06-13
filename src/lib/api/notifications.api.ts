import apiClient from "./client";
import type { ApiResponse, Notification, PaginatedResponse } from "@/types";

export const getNotifications = async (
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Notification>> => {
  const { data } = await apiClient.get<ApiResponse<Notification[]>>(
    "/notifications",
    { params: { page, limit } },
  );
  return { data: data.data, meta: data.meta! };
};

export const markAllRead = async (): Promise<string> => {
  const { data } = await apiClient.patch<ApiResponse<null>>(
    "/notifications/read",
  );
  return data.message;
};

export const markRead = async (id: string): Promise<string> => {
  const { data } = await apiClient.patch<ApiResponse<null>>(
    `/notifications/${id}/read`,
  );
  return data.message;
};
