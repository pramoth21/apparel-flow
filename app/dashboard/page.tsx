import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "CUTTING_SUPERVISOR":
      redirect("/supervisor");

    case "CUTTING_VERIFIER":
      redirect("/verifier");

    case "SEWING_SUPERVISOR":
      redirect("/sewing");

    default:
      redirect("/login");
  }
}