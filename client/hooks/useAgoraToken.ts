import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useAgoraToken(userId: string | null | undefined) {
  return useQuery(
    ['agora-token', userId],
    async () => {
      const resp = await api.get(`/agora/token`, { params: { userId } });
      return resp.data;
    },
    {
      enabled: Boolean(userId),
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
    }
  );
}
