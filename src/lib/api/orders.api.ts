import apiClient from "./client";
import type {
  ApiResponse,
  CreateOrderDto,
  CreateOrderResponse,
  Order,
} from "@/types";

export const createOrder = async (
  dto: CreateOrderDto,
): Promise<{ data: CreateOrderResponse; message: string }> => {
  const { data } = await apiClient.post<ApiResponse<CreateOrderResponse>>(
    "/orders",
    dto,
  );
  return { data: data.data, message: data.message };
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<ApiResponse<Order[]>>("/orders/my");
  return data.data;
};

export const trackOrder = async (
  orderNumber: string,
  email: string,
): Promise<Order> => {
  const { data } = await apiClient.get<ApiResponse<Order>>(
    `/orders/track/${orderNumber}`,
    { params: { email } },
  );
  return data.data;
};
