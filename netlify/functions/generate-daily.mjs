import { getStore } from "@netlify/blobs";
import { dateKey, generateDailyContent, parseDateKey, shanghaiParts, updateUsedTopics } from "./lib/daily-content.mjs";

async function generateAndStore(store, parts, used) {
  const key = dateKey(parts);
  const content = await generateDailyContent(parts, used);
  await store.setJSON(`daily/${key}`, content);
  await store.setJSON("latest", content);
  return {
    key,
    content,
    used: updateUsedTopics(used, content),
  };
}

export default async (req) => {
  try {
    const url = new URL(req.url);
    const requestedDate = parseDateKey(url.searchParams.get("date"));
    const store = getStore("daily-content");
    let used = (await store.get("used-topics", { type: "json", consistency: "strong" })) || {};
    const latest = await store.get("latest", { type: "json", consistency: "strong" });
    if (latest?.englishWords?.length || latest?.koreanWords?.length || latest?.fact?.question) {
      used = updateUsedTopics(used, latest);
    }
    const generated = [];

    const target = requestedDate || shanghaiParts(1);
    const result = await generateAndStore(store, target, used);
    used = result.used;
    generated.push(result.key);

    await store.setJSON("used-topics", used);

    return Response.json({
      ok: true,
      generated,
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
