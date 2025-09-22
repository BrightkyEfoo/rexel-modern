import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nextAuthApi } from "@/lib/api/nextauth-client";
import { toast } from "@/hooks/use-toast";

// Types
export interface AdminOrderIssue {
  id: number;
  issueNumber: string;
  type: string;
  priority: string;
  status: string;
  subject: string;
  description: string;
  attachments: string[];
  adminNotes: string | null;
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  order: {
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
  };
  assignedUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface UpdateOrderIssueData {
  status?: 'pending' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
  resolution?: string;
  assignedTo?: number;
}

export interface OrderIssuesResponse {
  data: AdminOrderIssue[];
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

// API functions
const adminOrderIssuesApi = {
  getAllIssues: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<OrderIssuesResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.priority) searchParams.append("priority", params.priority);
    if (params.search) searchParams.append("search", params.search);

    const url = `/admin/orders/issues${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await nextAuthApi.secured.get<OrderIssuesResponse>(url);
    return response.data;
  },

  updateIssue: async (
    issueId: number,
    data: UpdateOrderIssueData
  ): Promise<{ data: AdminOrderIssue }> => {
    const response = await nextAuthApi.secured.put<{ data: AdminOrderIssue }>(
      `/admin/orders/issues/${issueId}`,
      data
    );
    return response.data;
  },
};

// React Query hooks
export function useAdminOrderIssues(params: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ["admin-order-issues", params],
    queryFn: () => adminOrderIssuesApi.getAllIssues(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUpdateOrderIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, data }: { issueId: number; data: UpdateOrderIssueData }) =>
      adminOrderIssuesApi.updateIssue(issueId, data),
    onSuccess: (response) => {
      toast({
        title: "Signalement mis à jour",
        description: `Le signalement ${response.data.issueNumber} a été mis à jour avec succès.`,
      });

      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ["admin-order-issues"] });
      queryClient.invalidateQueries({ queryKey: ["order-issues"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de mise à jour",
        description: error.message || "Impossible de mettre à jour le signalement",
        variant: "destructive",
      });
    },
  });
}
