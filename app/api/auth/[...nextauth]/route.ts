import { GET, POST } from "@/lib/auth";

export { GET, POST };

// We need to export a config to prevent the middleware from running on these routes
export const config = {
  runtime: 'edge',
};