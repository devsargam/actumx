import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          Agent order history and execution status will be available here.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">Coming soon.</CardContent>
    </Card>
  );
}
