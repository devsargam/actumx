import { redirect } from "next/navigation";

import { LoginForm } from "@/app/login/login-form";
import { getServerSession } from "@/lib/server-auth";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/overview");
  }

  return <LoginForm />;
}
