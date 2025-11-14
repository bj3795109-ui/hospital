import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AIAndChat() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>AI and Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground text-center">
            Chat with your AI health companion for instant support and answers.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="default" className="w-full">Start Chat</Button>
            <Button variant="outline" className="w-full">View History</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
