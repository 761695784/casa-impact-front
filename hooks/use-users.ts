"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  usersService,
  type ListUsersParams,
} from "@/lib/services/users.service"
import type { User } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

export const USERS_QUERY_KEY = ["admin", "users"]

export function useUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => usersService.listUsers(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUser(id: number | string) {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => usersService.getUser(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      nom: string
      prenom?: string
      email: string
      role_slug: AdminRoleSlug
      statut?: "actif" | "inactif" | "suspendu"
    }) => usersService.createUser(payload),
    onSuccess: (created) => {
      toast.success("Compte utilisateur créé avec succès", {
        description: `${created.prenom || ""} ${created.nom} (${created.email})`,
      })
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la création du compte", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: {
        nom?: string
        prenom?: string
        email?: string
        role_slug?: AdminRoleSlug
        statut?: "actif" | "inactif" | "suspendu"
      }
    }) => usersService.updateUser(id, payload),
    onSuccess: (updated) => {
      toast.success("Compte utilisateur mis à jour", {
        description: `${updated.prenom || ""} ${updated.nom}`,
      })
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "user", updated.id],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du compte", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usersService.deleteUser(id),
    onSuccess: () => {
      toast.success("Compte utilisateur supprimé")
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression de l'utilisateur", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
