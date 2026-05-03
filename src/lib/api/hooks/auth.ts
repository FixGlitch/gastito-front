"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "@/lib/utils/toast";

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));
}

export function useMe() {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const res = await api.get<ApiResponse<AuthResponse>>("/auth/me", token ?? undefined);
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 15,
  });
}

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken);
      document.cookie = `auth_token=${data.tokens.accessToken}; path=/; max-age=86400; samesite=strict`;
      toast.success("Sesión iniciada correctamente");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      const msg = error.message.includes("Credenciales")
        ? "Correo o contraseña incorrectos"
        : error.message;
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken);
      document.cookie = `auth_token=${data.tokens.accessToken}; path=/; max-age=86400; samesite=strict`;
      toast.success("Cuenta creada exitosamente");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      const msg = error.message.includes("Ya existe")
        ? "Ya existe una cuenta con ese correo"
        : error.message;
      toast.error(msg);
    },
  });
}

export function useUpdateProfile() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await api.put<ApiResponse<User>>("/auth/me", data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el perfil");
    },
  });
}

export function useChangePassword() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await api.patch<ApiResponse<unknown>>("/auth/password", data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cambiar la contraseña");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      document.cookie = "auth_token=; path=/; max-age=0";
      clearAuth();
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
}
