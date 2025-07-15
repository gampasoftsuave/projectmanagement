import { ProjectQueryParams } from "@/interface/interface";

export function buildProjectsUrl(base: string, params: ProjectQueryParams) {
  const url = new URL(base, "http://dummy");
  url.searchParams.set("page", params.page.toString());
  url.searchParams.set("limit", params.limit.toString());
  if (params.status !== "all") url.searchParams.set("status", params.status);
  url.searchParams.set("sort", params.sort);
  return base + url.search;
}
