import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";
import { customFetch } from "~/lib/interceptor";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL ? `${env.NEXT_PUBLIC_API_URL}/trpc` : "http://localhost:8000/trpc",
    fetch: (url, options) => customFetch(url, options),
  });
};
