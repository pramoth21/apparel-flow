import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function VerifierPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "CUTTING_VERIFIER") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">
          Cutting Verifier
        </h1>

        <p className="mt-2 text-slate-400">
          Verify cutting batches and approve or reject them.
        </p>
      </div>
    </main>
  );
}