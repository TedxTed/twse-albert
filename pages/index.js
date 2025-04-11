// pages/index.js
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import StockSelector from "../components/StockSelector";
import StockDataDisplay from "../components/StockDataDisplay";
import TwseQueryParams from "../models/TwseQueryParams";
import twseApi from "../lib/twseApi";
import { Layout, Typography, Button, Card, Avatar, Menu, Dropdown } from "antd";
import {
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

export default function Home() {
  const router = useRouter();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user is logged in and handle window resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.push("/login");
      }

      // Check screen size for responsive layout
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth < 768) {
          setCollapsed(true);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [router]);

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
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      router.push("/login");
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        登出
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Head>
        <title>Albert的資料查詢系統</title>
        <meta name="description" content="Albert的資料查詢系統" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sider
        breakpoint="lg"
        collapsedWidth={isMobile ? "0" : "80"}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={220}
        className="min-h-screen"
        style={{
          position: isMobile ? "fixed" : "relative",
          zIndex: 99,
          height: "100vh",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className={`p-4 flex items-center justify-center ${
            collapsed ? "py-6" : "py-4"
          }`}
        >
          {!collapsed && (
            <Title level={4} className="text-gray-800 m-0 flex items-center">
              <span className="mr-2">Albert</span>
              <span className="text-gray-500 text-lg">系統</span>
            </Title>
          )}
          {collapsed && !isMobile && (
            <Avatar size={40} className="bg-gray-200 text-gray-700">
              A
            </Avatar>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="border-r-0"
          items={[
            {
              key: "1",
              icon: <BarChartOutlined />,
              label: "台灣證券交易所資料查詢",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="p-0 bg-white shadow-sm z-10">
          <div className="h-full flex items-center justify-between px-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />

            <div className="flex items-center">
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div className="flex items-center cursor-pointer">
                  <Avatar className="bg-gray-200 text-gray-700">A</Avatar>
                  <span className="ml-2 hidden md:inline">Albert</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50">
          <div
            className={`${
              isMobile && !collapsed ? "pl-60" : ""
            } transition-all duration-300`}
          >
            <div className="max-w-6xl mx-auto">
              <Title level={3} className="mb-6">
                股票資料查詢
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
          </div>
        </Content>

        <Footer className="text-center bg-white">
          Albert的資料查詢系統 ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
