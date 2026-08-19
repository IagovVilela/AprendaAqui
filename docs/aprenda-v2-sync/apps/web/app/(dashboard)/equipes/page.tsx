import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TeamsPanel } from "@/components/teams/teams-panel";

export default async function EquipesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <TeamsPanel />
    </div>
  );
}
