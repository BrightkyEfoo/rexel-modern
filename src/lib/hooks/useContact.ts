import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { nextAuthApi } from "@/lib/api/nextauth-client";
import { toast } from "@/hooks/use-toast";

// Types
export interface CreateContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: 'general' | 'quote' | 'support' | 'complaint' | 'other';
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  type: 'general' | 'quote' | 'support' | 'complaint' | 'other';
  status: 'new' | 'read' | 'replied' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata: Record<string, any>;
  adminNotes: string | null;
  replySubject: string | null;
  replyMessage: string | null;
  repliedAt: string | null;
  repliedBy: number | null;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
  repliedByUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ContactMessagesResponse {
  data: ContactMessage[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
  };
}

export interface ContactStats {
  total: number;
  new: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byStatus: Array<{ status: string; count: number }>;
  byType: Array<{ type: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
}

export interface UpdateContactMessageData {
  status?: 'new' | 'read' | 'replied' | 'resolved' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
  replySubject?: string;
  replyMessage?: string;
}

export interface ReplyContactMessageData {
  replySubject: string;
  replyMessage: string;
  sendEmail?: boolean;
}

// API functions
const contactApi = {
  // Public APIs
  sendMessage: async (data: CreateContactMessageData): Promise<{ data: ContactMessage }> => {
    const response = await apiClient.post<{ data: ContactMessage }>('/opened/contact', data);
    return response.data;
  },

  // Admin APIs
  getMessages: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    priority?: string;
    search?: string;
  } = {}): Promise<ContactMessagesResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.type) searchParams.append("type", params.type);
    if (params.priority) searchParams.append("priority", params.priority);
    if (params.search) searchParams.append("search", params.search);

    const url = `/admin/contact/messages${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await nextAuthApi.secured.get<ContactMessagesResponse>(url);
    return response.data;
  },

  getMessage: async (id: number): Promise<{ data: ContactMessage }> => {
    const response = await nextAuthApi.secured.get<{ data: ContactMessage }>(
      `/admin/contact/messages/${id}`
    );
    return response.data;
  },

  updateMessage: async (
    id: number,
    data: UpdateContactMessageData
  ): Promise<{ data: ContactMessage }> => {
    const response = await nextAuthApi.secured.put<{ data: ContactMessage }>(
      `/admin/contact/messages/${id}`,
      data
    );
    return response.data;
  },

  replyToMessage: async (
    id: number,
    data: ReplyContactMessageData
  ): Promise<{ data: ContactMessage }> => {
    const response = await nextAuthApi.secured.post<{ data: ContactMessage }>(
      `/admin/contact/messages/${id}/reply`,
      data
    );
    return response.data;
  },

  deleteMessage: async (id: number): Promise<void> => {
    await nextAuthApi.secured.delete(`/admin/contact/messages/${id}`);
  },

  getStats: async (): Promise<{ data: ContactStats }> => {
    const response = await nextAuthApi.secured.get<{ data: ContactStats }>(
      '/admin/contact/messages/stats'
    );
    return response.data;
  },

  markAsRead: async (messageIds: number[]): Promise<void> => {
    await nextAuthApi.secured.post('/admin/contact/messages/mark-read', { messageIds });
  },

  archive: async (messageIds: number[]): Promise<void> => {
    await nextAuthApi.secured.post('/admin/contact/messages/archive', { messageIds });
  },
};

// React Query hooks
export function useSendContactMessage() {
  return useMutation({
    mutationFn: (data: CreateContactMessageData) => contactApi.sendMessage(data),
    onSuccess: () => {
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
  });
}

export function useContactMessages(params: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ["contact-messages", params],
    queryFn: () => contactApi.getMessages(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useContactMessage(id: number) {
  return useQuery({
    queryKey: ["contact-message", id],
    queryFn: () => contactApi.getMessage(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactMessageData }) =>
      contactApi.updateMessage(id, data),
    onSuccess: (response) => {
      toast({
        title: "Message mis à jour",
        description: "Le message a été mis à jour avec succès.",
      });

      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["contact-message", response.data.id] });
      queryClient.invalidateQueries({ queryKey: ["contact-stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de mise à jour",
        description: error.message || "Impossible de mettre à jour le message",
        variant: "destructive",
      });
    },
  });
}

export function useReplyToContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReplyContactMessageData }) =>
      contactApi.replyToMessage(id, data),
    onSuccess: (response) => {
      toast({
        title: "Réponse envoyée",
        description: "La réponse a été envoyée avec succès.",
      });

      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["contact-message", response.data.id] });
      queryClient.invalidateQueries({ queryKey: ["contact-stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactApi.deleteMessage(id),
    onSuccess: () => {
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès.",
      });

      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["contact-stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de suppression",
        description: error.message || "Impossible de supprimer le message",
        variant: "destructive",
      });
    },
  });
}

export function useContactStats() {
  return useQuery({
    queryKey: ["contact-stats"],
    queryFn: () => contactApi.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMarkContactMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageIds: number[]) => contactApi.markAsRead(messageIds),
    onSuccess: () => {
      toast({
        title: "Messages marqués comme lus",
        description: "Les messages ont été marqués comme lus.",
      });

      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["contact-stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de marquer les messages comme lus",
        variant: "destructive",
      });
    },
  });
}

export function useArchiveContactMessages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageIds: number[]) => contactApi.archive(messageIds),
    onSuccess: () => {
      toast({
        title: "Messages archivés",
        description: "Les messages ont été archivés.",
      });

      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["contact-stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'archiver les messages",
        variant: "destructive",
      });
    },
  });
}
