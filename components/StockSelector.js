// components/StockSelector.js
import { Button, Input, Space, Form, Card, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const StockSelector = ({ onSearch, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const { month, year, stockIds } = values;

    // Parse the stock IDs (comma-separated)
    const parsedStockIds = stockIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id);

    onSearch(parsedStockIds, month, year);
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
          month: dayjs().month() + 1,
          year: dayjs().year(),
          stockIds:
            "2880,2881,2882,2883,2884,2885,2886,2887,2888,2889,2890,2891,2892,5880",
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

        <Space direction="horizontal" className="w-full">
          <Form.Item
            label="年份"
            name="year"
            rules={[{ required: true, message: "請選擇年份" }]}
            className="flex-1"
          >
            <Select className="w-full" placeholder="選擇年份">
              {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="月份"
            name="month"
            rules={[{ required: true, message: "請選擇月份" }]}
            className="flex-1"
          >
            <Select className="w-full" placeholder="選擇月份">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <Option key={month} value={month}>
                  {month}月
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Space>

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
