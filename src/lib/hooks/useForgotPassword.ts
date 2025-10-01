import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export function useForgotPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
      const response = await apiClient.post<{
        message: string;
      }>('/opened/auth/forgot-password', data);
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Email envoyé",
        description: data.message || "Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
}
