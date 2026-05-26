import { NextResponse } from "next/server";
import { getGithubRepositories } from "@/lib/github/repos";

export const revalidate = 3600;

export async function GET() {
  const repositories = await getGithubRepositories();

  return NextResponse.json({
    data: repositories,
    count: repositories.length,
  });
}
