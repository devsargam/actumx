import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <Card className="border-white/10 bg-white/[0.03] text-slate-100 ring-white/10">
      <CardHeader>
        <CardTitle className="text-white">Orders</CardTitle>
        <CardDescription className="text-slate-400">
          Agent order history and execution status will be available here.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-slate-300">Coming soon.</CardContent>
    </Card>
  );
}
