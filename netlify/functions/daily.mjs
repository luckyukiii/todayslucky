import { getStore } from "@netlify/blobs";
import { dateKey, parseDateKey, shanghaiParts } from "./lib/daily-content.mjs";

export default async (req) => {
  const url = new URL(req.url);
  const parts = parseDateKey(url.searchParams.get("date")) || shanghaiParts(0);
  const key = dateKey(parts);
  const store = getStore("daily-content");
  const content = await store.get(`daily/${key}`, { type: "json", consistency: "strong" });

  if (!content) {
    return Response.json(
      {
        ok: false,
        date: key,
        error: "Daily content has not been generated yet.",
      },
      { status: 404 },
    );
  }

  return Response.json({
    ok: true,
    content,
  });
};
