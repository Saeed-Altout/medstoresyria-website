"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { getGovernorates } from "@/lib/api/delivery.api";
import { createOrder, trackOrder } from "@/lib/api/orders.api";
import { createMaintenance, trackMaintenance } from "@/lib/api/maintenance.api";
import type {
  ApiResponse,
  CreateMaintenanceDto,
  CreateMaintenanceResponse,
  CreateOrderDto,
  CreateOrderResponse,
  Governorate,
  MaintenanceRequest,
  Order,
} from "@/types";

const errMessage = (err: AxiosError) =>
  (err.response?.data as ApiResponse<null> | undefined)?.message ??
  "Something went wrong";

export function useGovernorates() {
  return useQuery<Governorate[], AxiosError>({
    queryKey: ["governorates"],
    queryFn: getGovernorates,
    staleTime: 5 * 60_000,
  });
}

export function useCreateOrder() {
  return useMutation<
    { data: CreateOrderResponse; message: string },
    AxiosError,
    CreateOrderDto
  >({
    mutationFn: createOrder,
    onError: (err) => toast.error(errMessage(err)),
  });
}

export function useTrackOrder() {
  return useMutation<Order, AxiosError, { orderNumber: string; email: string }>(
    {
      mutationFn: ({ orderNumber, email }) => trackOrder(orderNumber, email),
      onError: (err) => toast.error(errMessage(err)),
    },
  );
}

export function useCreateMaintenance() {
  return useMutation<
    { data: CreateMaintenanceResponse; message: string },
    AxiosError,
    CreateMaintenanceDto
  >({
    mutationFn: createMaintenance,
    onError: (err) => toast.error(errMessage(err)),
  });
}

export function useTrackMaintenance() {
  return useMutation<
    MaintenanceRequest,
    AxiosError,
    { requestNumber: string; email: string }
  >({
    mutationFn: ({ requestNumber, email }) =>
      trackMaintenance(requestNumber, email),
    onError: (err) => toast.error(errMessage(err)),
  });
}
