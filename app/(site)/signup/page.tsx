import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { Container } from "@/components/container";
import { getCurrentUser, homeFor } from "@/lib/session";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "" } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(homeFor(user.role));

  return (
    <Container className="flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md rounded-3xl border border-black/5 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-500">Order faster, keep your bills, and track every delivery.</p>
        <div className="mt-6">
          <AuthForm mode="signup" next={next} />
        </div>
      </div>
    </Container>
  );
}
