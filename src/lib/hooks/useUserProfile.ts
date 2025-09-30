"use client";

import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/lib/api/services";
import type { User } from "@/lib/api/types";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await usersService.getCurrentUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

export function useUserProfileData(): User | null {
  const { data } = useUserProfile();
  return data || null;
}
