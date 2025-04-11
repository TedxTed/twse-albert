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

      <Sider
        breakpoint="lg"
        collapsedWidth={isMobile ? "0" : "80"}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={240}
        className="fixed left-0 top-0 h-full z-20"
        style={{
          background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflowY: "auto",
        }}
        theme="light"
      >
        <div
          className={`p-4 flex items-center justify-center border-b border-gray-100 ${
            collapsed ? "py-6" : "py-4"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center">
              <Avatar
                size={36}
                className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
              >
                A
              </Avatar>
              <Title level={4} className="text-gray-800 m-0 ml-3">
                Albert{" "}
                <span className="text-gray-400 text-sm font-normal">系統</span>
              </Title>
            </div>
          )}
          {collapsed && !isMobile && (
            <Avatar
              size={36}
              className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
            >
              A
            </Avatar>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[
            router.pathname === "/"
              ? "home"
              : router.pathname === "/twse-search"
              ? "twse"
              : "",
          ]}
          className="border-r-0 mt-2"
          style={{ borderRight: "none" }}
          items={[
            {
              key: "home",
              icon: <HomeOutlined style={{ fontSize: "18px" }} />,
              label: <span className="text-base">首頁</span>,
              className: "h-12 flex items-center",
              style: { height: 48 },
            },
            {
              key: "twse",
              icon: <BarChartOutlined style={{ fontSize: "18px" }} />,
              label: <span className="text-base">證券資料查詢</span>,
              className: "h-12 flex items-center",
              style: { height: 48 },
            },
          ]}
          onSelect={({ key }) => {
            if (key === "home") router.push("/");
            if (key === "twse") router.push("/twse-search");
          }}
        />

        {!collapsed && (
          <div className="absolute bottom-0 left-0 w-full bg-gray-50 p-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <ClockCircleOutlined className="mr-1" /> {currentTime}
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <CalendarOutlined className="mr-1" /> {currentDate}
            </div>
          </div>
        )}
      </Sider>

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 240,
          transition: "all 0.2s",
        }}
      >
        <Header
          className="p-0 bg-white shadow-sm sticky top-0 z-10 h-16"
          style={{ padding: "0 16px", height: 64 }}
        >
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="mr-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                style={{ fontSize: "16px", width: 40, height: 40 }}
              />
            </div>

            <div className="flex items-center">
              {/* 飯票顯示區塊 */}
              <div
                className="mr-4 flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 shadow-sm transform hover:scale-105 transition-transform duration-300"
                style={{
                  animation: "bounce 2s infinite",
                }}
              >
                <Badge
                  count={<RocketOutlined style={{ color: "blue" }} />}
                  offset={[-2, 0]}
                >
                  <span
                    className="text-sm font-bold mr-1"
                    style={{ color: "blue" }}
                  >
                    目前累計飯票：
                  </span>
                  <span
                    className="text-lg font-bold px-1"
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

              <div className="mr-4 hidden md:flex items-center px-3 py-1 rounded-full bg-gray-100">
                <ClockCircleOutlined className="mr-2 text-blue-500" />
                <span className="text-sm">{currentTime}</span>
              </div>

              <Dropdown
                overlay={userMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-full p-1 px-2">
                  <Avatar className="bg-gradient-to-r from-blue-500 to-blue-600">
                    A
                  </Avatar>
                  <span className="ml-2 hidden md:inline text-sm font-medium">
                    Albert
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50 min-h-screen">{children}</Content>

        <Footer
          className="text-center bg-white py-4"
          style={{ borderTop: "1px solid #f0f0f0" }}
        >
          <div className="text-gray-500 text-sm">
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
