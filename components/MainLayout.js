// components/MainLayout.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import {
  Layout,
  Typography,
  Button,
  Avatar,
  Menu,
  Dropdown,
  Badge,
} from "antd";

import {
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

export default function MainLayout({
  children,
  title = "Albert的資料查詢系統",
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [mealTickets, setMealTickets] = useState(2); // 預設值為2張飯票

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

      // Set current time and date
      const updateDateTime = () => {
        const now = new Date();

        // Format time: HH:MM:SS
        const time = now.toLocaleTimeString("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // Format date: YYYY/MM/DD Weekday
        const weekdays = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ];
        const date = `${now.getFullYear()}/${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")} ${
          weekdays[now.getDay()]
        }`;

        setCurrentTime(time);
        setCurrentDate(date);
      };

      handleResize();
      updateDateTime();

      window.addEventListener("resize", handleResize);
      const timerID = setInterval(updateDateTime, 1000);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearInterval(timerID);
      };
    }
  }, [router]);

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
    <Layout style={{ minHeight: "100vh" }}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sider 已移除 */}

      <Layout
        style={{
          marginLeft: 0, // sidebar移除後，marginLeft設為0
          transition: "all 0.2s",
        }}
      >
        <Header
          className="sticky top-0 z-10 h-16 p-0 bg-white shadow-sm"
          style={{ padding: "0 16px", height: 64 }}
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              {/* 系統名稱 */}
              <span className="text-lg font-bold tracking-wide text-blue-700 select-none">
                Albert的資料查詢系統
              </span>
            </div>

            <div className="flex items-center">
              {/* 飯票顯示區塊 */}
              <div
                className="flex items-center px-3 py-1 mr-4 transition-transform duration-300 transform border border-yellow-300 rounded-full shadow-sm bg-gradient-to-r from-yellow-100 to-yellow-200 hover:scale-105"
                style={{
                  animation: "bounce 2s infinite",
                }}
              >
                <Badge
                  count={<RocketOutlined style={{ color: "blue" }} />}
                  offset={[-2, 0]}
                >
                  <span
                    className="mr-1 text-sm font-bold"
                    style={{ color: "blue" }}
                  >
                    目前累計飯票：
                  </span>
                  <span
                    className="px-1 text-lg font-bold"
                    style={{
                      color: "blue",
                      fontFamily: "'Comic Sans MS', cursive",
                    }}
                  >
                    {mealTickets}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "blue" }}>
                    張
                  </span>
                </Badge>
              </div>

              <div className="items-center hidden px-3 py-1 mr-4 bg-gray-100 rounded-full md:flex">
                <ClockCircleOutlined className="mr-2 text-blue-500" />
                <span className="text-sm">{currentTime}</span>
              </div>

              <Dropdown
                overlay={userMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="flex items-center p-1 px-2 rounded-full cursor-pointer hover:bg-gray-50">
                  <Avatar className="bg-gradient-to-r from-blue-500 to-blue-600">
                    A
                  </Avatar>
                  <span className="hidden ml-2 text-sm font-medium md:inline">
                    Albert
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content className="min-h-screen p-6 bg-gray-50">{children}</Content>

        <Footer
          className="py-4 text-center bg-white"
          style={{ borderTop: "1px solid #f0f0f0" }}
        >
          <div className="text-sm text-gray-500">
            Albert的資料查詢系統 ©{new Date().getFullYear()} | 版本 1.0.2 ｜
            powered by 踢一滴
          </div>
        </Footer>
      </Layout>

      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </Layout>
  );
}
