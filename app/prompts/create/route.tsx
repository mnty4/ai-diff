import { redirect } from "next/navigation";

export async function GET() {
  const id = crypto.randomUUID();
  redirect(`/prompts/${id}`);
}
