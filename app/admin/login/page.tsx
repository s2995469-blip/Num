import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { getAdmin } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Logo tone="light" className="mx-auto h-auto w-24" priority />
        <h1 className="display-sm mt-8 text-center">Practitioner sign in</h1>
        <div className="mt-10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
