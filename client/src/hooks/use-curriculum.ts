import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { FullUnit, TopicToggleRequest } from "@shared/schema";

export function useCurriculum() {
  return useQuery({
    queryKey: [api.curriculum.get.path],
    queryFn: async () => {
      const res = await fetch(api.curriculum.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch curriculum");
      const data = await res.json();
      return api.curriculum.get.responses[200].parse(data) as FullUnit[];
    },
  });
}

export function useToggleTopic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const url = buildUrl(api.topics.toggle.path, { id });
      const body: TopicToggleRequest = { completed };
      const validated = api.topics.toggle.input.parse(body);
      
      const res = await fetch(url, {
        method: api.topics.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Topic not found");
        }
        throw new Error("Failed to toggle topic");
      }
      
      return api.topics.toggle.responses[200].parse(await res.json());
    },
    // Optimistic update could go here, but invalidating is safer for aggregated progress
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.curriculum.get.path] });
    },
  });
}
