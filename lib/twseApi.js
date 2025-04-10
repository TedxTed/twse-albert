// lib/twseApi.js
import axios from "axios";
import * as R from "ramda";

// This API call will be handled by our Next.js backend API
const fetchStockList = async (params) => {
  try {
    const response = await axios.post("/api/twse", {
      action: "fetchStockList",
      params: params.toPostData(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stock list:", error);
    return [];
  }
};

// This API call will be handled by our Next.js backend API
const fetchStockDetailHtml = async (url) => {
  try {
    const response = await axios.post("/api/twse", {
      action: "fetchStockDetailHtml",
      url,
    });
    return response.data.html;
  } catch (error) {
    console.error("Error fetching stock detail:", error);
    return null;
  }
};

const generateStockHtml = async (stockIds, startDate, endDate, params) => {
  try {
    const stockList = await fetchStockList(params);

    const results = await Promise.all(
      stockIds.map(async (id) => {
        const item = stockList.find((v) => v.companyId === id);
        if (!item) {
          return {
            id,
            html: `<div>股票代號: ${id} 無資料</div>`,
            hasData: false,
          };
        }

        const detail = await fetchStockDetailHtml(item.hyperlink);
        return {
          id,
          html: detail || `<div>股票代號: ${id} 無資料</div>`,
          hasData: !!detail,
          name: item.companyName || id,
        };
      })
    );

    return results;
  } catch (error) {
    console.error("Error generating stock HTML:", error);
    return stockIds.map((id) => ({
      id,
      html: `<div>股票代號: ${id} 無資料</div>`,
      hasData: false,
    }));
  }
};

export default {
  fetchStockList,
  fetchStockDetailHtml,
  generateStockHtml,
};
