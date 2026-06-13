"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { getMyOrders } from "@/lib/api/orders.api";
import { getMyMaintenance } from "@/lib/api/maintenance.api";
import {
  getNotifications,
  markAllRead,
  markRead,
} from "@/lib/api/notifications.api";
import { useAuthStore } from "@/stores/auth.store";
import type {
  ApiResponse,
  MaintenanceRequest,
  Notification,
  Order,
  PaginatedResponse,
} from "@/types";

const errMessage = (err: AxiosError) =>
  (err.response?.data as ApiResponse<null> | undefined)?.message ??
  "Something went wrong";

export const accountKeys = {
  orders: ["account", "orders"] as const,
  maintenance: ["account", "maintenance"] as const,
  notifications: ["account", "notifications"] as const,
};

export function useMyOrders() {
  const enabled = !!useAuthStore((s) => s.accessToken);
  return useQuery<Order[], AxiosError>({
    queryKey: accountKeys.orders,
    queryFn: getMyOrders,
    enabled,
  });
}

export function useMyMaintenance() {
  const enabled = !!useAuthStore((s) => s.accessToken);
  return useQuery<MaintenanceRequest[], AxiosError>({
    queryKey: accountKeys.maintenance,
    queryFn: getMyMaintenance,
    enabled,
  });
}

export function useNotifications() {
  const enabled = !!useAuthStore((s) => s.accessToken);
  return useQuery<PaginatedResponse<Notification>, AxiosError>({
    queryKey: accountKeys.notifications,
    queryFn: () => getNotifications(),
    enabled,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation<string, AxiosError, void>({
    mutationFn: markAllRead,
    onSuccess: (message) => {
      qc.invalidateQueries({ queryKey: accountKeys.notifications });
      toast.success(message);
    },
    onError: (err) => toast.error(errMessage(err)),
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation<string, AxiosError, string>({
    mutationFn: markRead,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.notifications }),
    onError: (err) => toast.error(errMessage(err)),
  });
}
