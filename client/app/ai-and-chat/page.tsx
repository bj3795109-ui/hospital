"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAgoraToken } from '@/hooks/useAgoraToken';


export default function AIAndChat() {
  const [userId, setUserId] = useState('alice');
  const { data: tokenInfo, isFetching, refetch } = useAgoraToken(userId || undefined);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>AI and Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground text-center">Chat with your AI health companion for instant support and answers.</p>

          <div className="flex flex-col gap-3">
            <label className="text-sm">User ID</label>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} className="p-2 rounded border" />
            <Button variant="default" className="w-full" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Requesting token...' : 'Start Chat (request token)'}
            </Button>

            {tokenInfo && (
              <div className="mt-3 p-3 rounded bg-white dark:bg-zinc-800 border">
                <strong>Token response:</strong>
                <pre className="text-xs mt-2 max-h-40 overflow-auto">{JSON.stringify(tokenInfo, null, 2)}</pre>

                <div className="mt-3 text-sm">
                  <p>Example initialization (use with the <code>agora-chat</code> SDK):</p>
                  <pre className="text-xs mt-2 bg-zinc-100 p-2 rounded">
{`import AgoraChat from 'agora-chat'\n\nconst client = AgoraChat.getInstance()\nawait client.createClient({ appId: '${tokenInfo?.appId}' })\nawait client.login({ userId: '${tokenInfo?.userId}', token: '${tokenInfo?.token}' })\n\n// then create/join conversation and send/receive messages`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
