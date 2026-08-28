"use client"

import { useQuery } from "@tanstack/react-query"
import { adminService } from "@/lib/services/admin.service"
import type { AdminDashboardData } from "@/types/admin"

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboardData(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  })
}
