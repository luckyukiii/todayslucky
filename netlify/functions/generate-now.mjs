import { getStore } from "@netlify/blobs";
import { dateKey, generateDailyContent, parseDateKey, shanghaiParts, updateUsedTopics } from "./lib/daily-content.mjs";

export default async (req) => {
  try {
    const url = new URL(req.url);
    const secret = process.env.ADMIN_SECRET;

    if (!secret || url.searchParams.get("secret") !== secret) {
      return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const parts = parseDateKey(url.searchParams.get("date")) || shanghaiParts(0);
    const key = dateKey(parts);
    const store = getStore("daily-content");
    let used = (await store.get("used-topics", { type: "json", consistency: "strong" })) || {};
    const latest = await store.get("latest", { type: "json", consistency: "strong" });
    if (latest?.englishWords?.length || latest?.koreanWords?.length || latest?.fact?.question) {
      used = updateUsedTopics(used, latest);
    }
    const content = await generateDailyContent(parts, used);

    await store.setJSON(`daily/${key}`, content);
    await store.setJSON("latest", content);
    await store.setJSON("used-topics", updateUsedTopics(used, content));

    return Response.json({
      ok: true,
      generated: key,
      generatedAt: content.generatedAt,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
};
