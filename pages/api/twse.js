// pages/api/twse.js
import axios from "axios";
import { JSDOM } from "jsdom";
import * as R from "ramda";

const baseUrl = "https://mopsov.twse.com.tw/mops/web/ezsearch_query";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { action, params, url } = req.body;

    if (action === "fetchStockList") {
      const data = await fetchStockList(params);
      return res.status(200).json(data);
    }

    if (action === "fetchStockDetailHtml") {
      const html = await fetchStockDetailHtml(url);
      return res.status(200).json({ html });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

const fetchStockList = async (params) => {
  const postData = R.pipe(
    R.toPairs,
    R.map(([k, v]) => `${k}=${encodeURIComponent(v)}`),
    R.join("&")
  )(params);

  const res = await axios.post(baseUrl, postData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

  const toCamel = R.pipe(
    R.toLower,
    R.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
  );

  const adapt = R.map(
    R.pipe(
      R.toPairs,
      R.map(([k, v]) => [toCamel(k), v]),
      R.fromPairs
    )
  );

  return R.pipe(R.path(["data", "data"]), adapt)(res);
};

const fetchStockDetailHtml = async (url) => {
  const res = await axios.get(url);
  const doc = new JSDOM(res.data).window.document;
  const table = doc.querySelector("table.hasBorder");
  return table?.outerHTML ?? null;
};
