// pages/twse-search.js
import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import StockSelector from "../components/StockSelector";
import StockDataDisplay from "../components/StockDataDisplay";
import TwseQueryParams from "../models/TwseQueryParams";
import twseApi from "../lib/twseApi";
import { Typography, Card, Divider } from "antd";

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
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <Title 
              level={2} 
              className="mb-2"
              style={{ 
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              📊 台灣證券交易所資料查詢
            </Title>
            <p className="text-gray-600 text-lg">快速查詢上市公司自結財務資料</p>
            <Divider />
          </div>

          {/* Search Form */}
          <Card 
            className="shadow-lg border-0 mb-6"
            style={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
            }}
          >
            <StockSelector onSearch={handleSearch} loading={loading} />
          </Card>

          {/* Results */}
          <Card
            className="shadow-lg border-0"
            style={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              minHeight: '600px'
            }}
            styles={{ 
              body: {
                padding: stockData.length > 0 ? "24px" : "48px",
                borderRadius: '16px'
              }
            }}
          >
            <StockDataDisplay stockData={stockData} loading={loading} />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
