import apiClient from "./client";
import type {
  ApiResponse,
  CreateMaintenanceDto,
  CreateMaintenanceResponse,
  MaintenanceRequest,
} from "@/types";

export const createMaintenance = async (
  dto: CreateMaintenanceDto,
): Promise<{ data: CreateMaintenanceResponse; message: string }> => {
  const { data } = await apiClient.post<ApiResponse<CreateMaintenanceResponse>>(
    "/maintenance",
    dto,
  );
  return { data: data.data, message: data.message };
};

export const getMyMaintenance = async (): Promise<MaintenanceRequest[]> => {
  const { data } = await apiClient.get<ApiResponse<MaintenanceRequest[]>>(
    "/maintenance/my",
  );
  return data.data;
};

export const trackMaintenance = async (
  requestNumber: string,
  email: string,
): Promise<MaintenanceRequest> => {
  const { data } = await apiClient.get<ApiResponse<MaintenanceRequest>>(
    `/maintenance/track/${requestNumber}`,
    { params: { email } },
  );
  return data.data;
};
