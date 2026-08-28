"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  contactMessagesService,
  type ListContactMessagesParams,
} from "@/lib/services/contact-messages.service"
import type { ContactMessage } from "@/types/models"

export const CONTACT_MESSAGES_QUERY_KEY = ["admin", "contact-messages"]

export function useContactMessages(params: ListContactMessagesParams = {}) {
  return useQuery({
    queryKey: [...CONTACT_MESSAGES_QUERY_KEY, params],
    queryFn: () => contactMessagesService.listContactMessages(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useContactMessage(id: number | string) {
  return useQuery({
    queryKey: ["admin", "contact-message", id],
    queryFn: () => contactMessagesService.getContactMessage(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<ContactMessage>
    }) => contactMessagesService.updateContactMessage(id, payload),
    onSuccess: (updated) => {
      toast.success("Message mis à jour", {
        description: `Statut : ${updated.statut}`,
      })
      queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "contact-message", updated.id],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du message", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useMarkContactMessageAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => contactMessagesService.markAsRead(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "contact-message", updated.id],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      contactMessagesService.deleteContactMessage(id),
    onSuccess: () => {
      toast.success("Message supprimé")
      queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression du message", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
