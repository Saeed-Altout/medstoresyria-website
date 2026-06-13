import apiClient from "./client";
import type { ApiResponse, Setting } from "@/types";

export const getSettings = async (): Promise<Setting[]> => {
  const { data } = await apiClient.get<ApiResponse<Setting[]>>("/settings");
  return data.data;
};

/** Convenience: settings as a flat key→value map. */
export const getSettingsMap = async (): Promise<Record<string, string>> => {
  const list = await getSettings();
  return Object.fromEntries(list.map((s) => [s.key, s.value]));
};
