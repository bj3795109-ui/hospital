import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export type AgoraTokenInfo = {
  token: string;
  appId: string;
  userId: string;
  expireTimestamp?: number;
};

export function useAgoraToken(userId: string | null | undefined) {
  // Use object-style API for @tanstack/react-query v5
  return useQuery<AgoraTokenInfo, unknown, AgoraTokenInfo | undefined>({
    queryKey: ['agora-token', userId],
    queryFn: async () => {
      const resp = await api.get(`/agora/token`, { params: { userId } });
      return resp.data as AgoraTokenInfo;
    },
    enabled: Boolean(userId),
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });
}
