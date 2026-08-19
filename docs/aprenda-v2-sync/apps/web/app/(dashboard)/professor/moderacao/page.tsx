import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/require-teacher";
import { ModerationPanel } from "@/components/professor/moderation-panel";

export default async function ModeracaoPage() {
  const auth = await requireTeacher();
  if (!auth.ok) {
    redirect(auth.error === "unauthenticated" ? "/login" : "/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <ModerationPanel />
    </div>
  );
}
