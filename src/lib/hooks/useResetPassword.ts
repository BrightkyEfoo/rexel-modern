import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export function useResetPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
      const response = await apiClient.post<{
        message: string;
      }>('/opened/auth/reset-password', data);
      
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Mot de passe réinitialisé",
        description: data.message || "Votre mot de passe a été réinitialisé avec succès.",
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
