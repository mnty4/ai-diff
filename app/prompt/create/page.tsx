import { redirect } from "next/navigation";

export default function CreatePage() {
  const id = crypto.randomUUID();
  redirect(`/prompt/${id}`);
}
