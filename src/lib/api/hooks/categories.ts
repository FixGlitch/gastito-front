import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryResponse } from "@/types/api";
import { useAuthStore } from "@/lib/store/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export function useCategories(activeOnly: boolean = true) {
  const { token } = useAuthStore();
  
  return useQuery({
    queryKey: ["categories", activeOnly],
    queryFn: async (): Promise<CategoryResponse[]> => {
      const res = await fetch(`${API_URL}/categories?activeOnly=${activeOnly}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener categorías");
      const json = await res.json();
      return json.data || json;
    },
    enabled: !!token,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { name: string; color?: string; icon?: string }) => {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear categoría");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
