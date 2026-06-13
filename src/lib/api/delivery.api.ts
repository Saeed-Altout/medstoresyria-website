import apiClient from "./client";
import type { ApiResponse, Governorate } from "@/types";

export const getGovernorates = async (): Promise<Governorate[]> => {
  const { data } = await apiClient.get<ApiResponse<Governorate[]>>(
    "/delivery/governorates",
  );
  return data.data;
};
