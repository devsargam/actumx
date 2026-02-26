import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UseSpongePage() {
  return (
    <Card className="border-white/10 bg-white/[0.03] text-slate-100 ring-white/10">
      <CardHeader>
        <CardTitle className="text-white">Use Sponge</CardTitle>
        <CardDescription className="text-slate-400">
          Actions and workflows for using Sponge will be added here.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-slate-300">Coming soon.</CardContent>
    </Card>
  );
}
