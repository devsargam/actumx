import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentRequestsPage() {
  return (
    <Card className="border-white/10 bg-white/[0.03] text-slate-100 ring-white/10">
      <CardHeader>
        <CardTitle className="text-white">Agent Requests</CardTitle>
        <CardDescription className="text-slate-400">
          Incoming and processed requests from agents will be listed here.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-slate-300">Coming soon.</CardContent>
    </Card>
  );
}
