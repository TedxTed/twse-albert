// pages/index.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";
import { Typography, Button, Card, Badge, Row, Col, Statistic } from "antd";
import { BarChartOutlined, RiseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Home() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set current date
      const updateDate = () => {
        const now = new Date();

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

        setCurrentDate(date);
      };

      updateDate();
    }
  }, []);

  // Mock market data
  const marketData = {
    taiex: 21574.83,
    change: 112.09,
    changePercent: 0.52,
  };

  return (
    <MainLayout title="Albert的資料查詢系統">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="m-0">
            歡迎回來，Albert
          </Title>
          <div className="text-sm text-gray-500">{currentDate}</div>
        </div>

        <Card
          className="h-full hover:shadow-md transition-shadow"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Title level={5}>快速訪問</Title>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button
              type="primary"
              icon={<BarChartOutlined />}
              size="large"
              onClick={() => router.push("/twse-search")}
              className="h-12 pl-4 pr-6 flex items-center"
              style={{
                background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
              }}
            >
              <span className="ml-1 text-base">台灣證券交易所資料查詢</span>
            </Button>
          </div>
        </Card>

        <Card
          title="系統公告"
          className="shadow-sm mt-6"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          headStyle={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <div className="py-2">
            <div className="flex items-start mb-4">
              <Badge status="processing" className="mt-2" />
              <div className="ml-3">
                <div className="text-gray-800 font-medium">系統更新通知</div>
                <div className="text-gray-500 text-sm mt-1">
                  呦！更新一波, 需要其他功能就在這個系統加, 歡迎用飯票買功能
                </div>
                <div className="text-gray-400 text-xs mt-2">2025/04/11</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
