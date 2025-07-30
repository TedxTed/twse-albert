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

          {/* Search Form - 精簡版 */}
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
