// pages/twse-search.js
import { useState } from "react";
import MainLayout from "../components/MainLayout";
import StockSelector from "../components/StockSelector";
import StockDataDisplay from "../components/StockDataDisplay";
import TwseQueryParams from "../models/TwseQueryParams";
import twseApi from "../lib/twseApi";
import { Typography, Card, Divider, Spin } from "antd";

const { Title } = Typography;

export default function TwseSearch() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(true); // ✅ 新增 state

  // 檢查是否在 2025/8/6 之前，用於顯示提醒
  const isExpired = () => {
    const now = new Date();
    const expiryDate = new Date("2025-08-06T18:30:00+08:00");
    return now >= expiryDate;
  };

  const handleSearch = async (stockIds, month, year) => {
    setLoading(true);
    try {
      const params = new TwseQueryParams(month, year);
      const results = await twseApi.generateStockHtml(
        stockIds,
        params.startDate,
        params.endDate,
        params
      );
      setStockData(results);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="台灣證券交易所資料查詢 - Albert的資料查詢系統">
      {/* 浮動提醒卡片 */}
      {!isExpired() && showNotice && (
        <div
          className="fixed z-50 top-14 right-6"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.25)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "320px",
          }}
        >
          <div style={{ fontSize: "22px" }}>🍽️</div>
          <div style={{ flex: 1, color: "#1a1a1a" }}>
            <div style={{ fontSize: "15px", fontWeight: 600 }}>
              聚餐提醒：8/6 旭集 微風廣場
            </div>
            <div style={{ fontSize: "13px", color: "#444" }}>18:30 見 👋</div>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "#888",
              fontSize: "16px",
              cursor: "pointer",
              lineHeight: 1,
            }}
            aria-label="關閉通知"
            title="關閉"
          >
            ✕
          </button>
        </div>
      )}

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-10px) rotate(-2deg);
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 text-center">
            <Title
              level={2}
              className="mb-2"
              style={{
                background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              📊 台灣證券交易所資料查詢
            </Title>
            <p className="text-base text-gray-600 sm:text-lg">
              快速查詢上市公司自結財務資料
            </p>
            <Divider />
          </div>

          {/* Search Form */}
          <Card
            className="mb-6"
            style={{
              borderRadius: 12,
              padding: "20px",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            <StockSelector onSearch={handleSearch} loading={loading} />
          </Card>

          {/* Results */}
          <Card
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              minHeight: "600px",
            }}
            bodyStyle={{
              padding: stockData.length > 0 ? "24px" : "48px",
              borderRadius: "12px",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spin tip="資料查詢中..." size="large" />
              </div>
            ) : stockData.length === 0 ? (
              <div className="mt-8 text-lg text-center text-gray-500">
                查無符合條件的資料
              </div>
            ) : (
              <StockDataDisplay stockData={stockData} />
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
