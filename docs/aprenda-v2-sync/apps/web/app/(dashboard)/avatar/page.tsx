import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AvatarStudio } from "@/components/avatar/avatar-studio";

export default async function AvatarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <AvatarStudio />
    </div>
  );
}
