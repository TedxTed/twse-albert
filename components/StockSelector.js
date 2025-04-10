// components/StockSelector.js
import { useState } from "react";
import { DatePicker, Button, Input, Space, Form, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const StockSelector = ({ onSearch, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const { dateRange, stockIds } = values;

    // Convert dates to the format expected by the API (YYYYMMDD)
    const startDate = dateRange[0].format("YYYYMMDD");
    const endDate = dateRange[1].format("YYYYMMDD");

    // Parse the stock IDs (comma-separated)
    const parsedStockIds = stockIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id);

    onSearch(parsedStockIds, startDate, endDate);
  };

  return (
    <Card
      title="台灣證券交易所資料查詢"
      className="mb-6 shadow-md"
      extra={<span className="text-gray-500 text-sm">請輸入股票代號</span>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          dateRange: [dayjs().subtract(7, "day"), dayjs()],
          stockIds: "2880,2881,2882,2883,2884,2885",
        }}
      >
        <Form.Item
          label="股票代號"
          name="stockIds"
          rules={[{ required: true, message: "請輸入股票代號" }]}
        >
          <Input
            placeholder="請輸入股票代號，例如: 2880,2881,2882"
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          label="日期範圍"
          name="dateRange"
          rules={[{ required: true, message: "請選擇日期範圍" }]}
        >
          <RangePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
            className="w-full"
          >
            查詢資料
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StockSelector;
