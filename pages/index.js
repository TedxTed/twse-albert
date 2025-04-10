// pages/index.js
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import StockSelector from "../components/StockSelector";
import StockDataDisplay from "../components/StockDataDisplay";
import TwseQueryParams from "../models/TwseQueryParams";
import twseApi from "../lib/twseApi";
import { Layout, Typography, Divider, Button } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function Home() {
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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
    }
  };

  return (
    <Layout className="min-h-screen">
      <Head>
        <title>台灣證券交易所資料查詢系統</title>
        <meta name="description" content="台灣證券交易所資料查詢系統" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header className="bg-white shadow-sm flex items-center justify-between px-6">
        <div className="text-xl font-bold">台灣證券交易所資料查詢系統</div>
        <Button type="link" onClick={handleLogout}>登出</Button>
      </Header>

      <Content className="p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <StockSelector onSearch={handleSearch} loading={loading} />

          <Divider />

          <StockDataDisplay stockData={stockData} loading={loading} />
        </div>
      </Content>

      <Footer className="text-center bg-white">
        台灣證券交易所資料查詢系統 ©{new Date().getFullYear()} created by 踢一滴
      </Footer>
    </Layout>
  );
}
