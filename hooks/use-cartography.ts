"use client"

import { useQuery } from "@tanstack/react-query"
import {
  cartographyService,
  type ListMapPointsParams,
} from "@/lib/services/cartography.service"

export const CARTOGRAPHY_QUERY_KEY = ["admin", "cartography"]

export function useCartographyPoints(params: ListMapPointsParams = {}) {
  return useQuery({
    queryKey: [...CARTOGRAPHY_QUERY_KEY, params],
    queryFn: () => cartographyService.listMapPoints(params),
    staleTime: 1000 * 60 * 5,
  })
}
