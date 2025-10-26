import { fetchPromptsFromDB } from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("pageSize") || 15);

  const prompts = await fetchPromptsFromDB(page, pageSize);

  return new Response(JSON.stringify(prompts));
}
