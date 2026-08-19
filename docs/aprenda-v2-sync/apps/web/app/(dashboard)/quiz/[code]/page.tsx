import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LiveQuizRoom } from "@/components/quiz/live-quiz-room";

export default async function QuizRoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { code } = await params;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <LiveQuizRoom code={code.toUpperCase()} />
    </div>
  );
}
