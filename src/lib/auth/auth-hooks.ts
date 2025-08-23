import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from './auth-service';
import type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse
} from '../api/types';

// Query Keys
export const authKeys = {
  currentUser: ['auth', 'currentUser'] as const,
  isAuthenticated: ['auth', 'isAuthenticated'] as const,
} as const;

// Current user hook
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Authentication status hook
export function useIsAuthenticated() {
  return useQuery({
    queryKey: authKeys.isAuthenticated,
    queryFn: () => authService.isAuthenticated(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    initialData: false, // Valeur par défaut avant hydratation
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Update auth status
      queryClient.setQueryData(authKeys.isAuthenticated, true);
      queryClient.setQueryData(authKeys.currentUser, data.user);

      // Invalidate all queries to refresh with authenticated state
      queryClient.invalidateQueries();
    },
    onError: () => {
      // Clear auth data on error
      queryClient.setQueryData(authKeys.isAuthenticated, false);
      queryClient.removeQueries({ queryKey: authKeys.currentUser });
    }
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => {
      console.log('🚀 Frontend register mutation called:', { email: userData.email });
      return authService.register(userData);
    },
    onSuccess: (data: AuthResponse) => {
      // Note: Pour le register, on ne met pas à jour les données d'auth
      // car l'utilisateur doit d'abord vérifier son email
      console.log('✅ Registration successful, need OTP verification');
    },
    onError: (error) => {
      // Ne pas invalider les queries sur erreur de register
      console.error('❌ Registration error:', error);
    },
    // Empêcher les appels multiples rapprochés
    retry: false,
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all auth data
      queryClient.setQueryData(authKeys.isAuthenticated, false);
      queryClient.removeQueries({ queryKey: authKeys.currentUser });

      // Clear all cached data and redirect to home
      queryClient.clear();

      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) => authService.updateProfile(userData),
    onSuccess: (updatedUser: User) => {
      // Update current user data
      queryClient.setQueryData(authKeys.currentUser, updatedUser);
    }
  });
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(currentPassword, newPassword)
  });
}

// Request password reset mutation
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email)
  });
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword)
  });
}

// Verify email mutation
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      // Refresh current user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    }
  });
}

// Resend verification email mutation
export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: () => authService.resendVerificationEmail()
  });
}

// Auth state helpers
export function useAuthUser() {
  const { data: user, isLoading, error } = useCurrentUser();
  const { data: isAuthenticated } = useIsAuthenticated();

  return {
    user: user || null,
    isLoading,
    isAuthenticated: isAuthenticated || false,
    error,
    hasRole: (role: string) => authService.hasRole(role),
    hasAnyRole: (roles: string[]) => authService.hasAnyRole(roles)
  };
}

// Role-based access control hook
export function useRequireAuth(requiredRoles?: string[]) {
  const { user, isAuthenticated, isLoading } = useAuthUser();

  const hasRequiredRole = requiredRoles
    ? authService.hasAnyRole(requiredRoles)
    : true;

  return {
    user,
    isAuthenticated,
    isLoading,
    hasAccess: isAuthenticated && hasRequiredRole,
    needsAuth: !isAuthenticated,
    needsRole: isAuthenticated && !hasRequiredRole
  };
}
