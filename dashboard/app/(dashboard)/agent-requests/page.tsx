import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentRequestsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Requests</CardTitle>
        <CardDescription>
          Incoming and processed requests from agents will be listed here.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">Coming soon.</CardContent>
    </Card>
  );
}
