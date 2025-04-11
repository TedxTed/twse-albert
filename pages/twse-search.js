// pages/twse-search.js
import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import StockSelector from "../components/StockSelector";
import StockDataDisplay from "../components/StockDataDisplay";
import TwseQueryParams from "../models/TwseQueryParams";
import twseApi from "../lib/twseApi";
import { Typography, Card } from "antd";

const { Title } = Typography;

export default function TwseSearch() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (stockIds, startDate, endDate) => {
    setLoading(true);
    try {
      const params = new TwseQueryParams(startDate, endDate);
      const results = await twseApi.generateStockHtml(
        stockIds,
        startDate,
        endDate,
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
      <div className="max-w-6xl mx-auto">
        <Title level={3} className="mb-6">
          台灣證券交易所資料查詢
        </Title>

        <Card className="shadow-sm mb-6">
          <StockSelector onSearch={handleSearch} loading={loading} />
        </Card>

        <Card
          className="shadow-sm"
          bodyStyle={{ padding: stockData.length > 0 ? "24px" : 0 }}
        >
          <StockDataDisplay stockData={stockData} loading={loading} />
        </Card>
      </div>
    </MainLayout>
  );
}
