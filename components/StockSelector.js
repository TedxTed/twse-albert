// components/StockSelector.js
import { Button, Input, Form, Select, Row, Col } from "antd";
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
    <div>
      <div className="mb-6">
        <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-800">
          🔍 查詢條件
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          請選擇要查詢的股票代號和時間範圍
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          month: dayjs().month() + 1,
          year: dayjs().year(),
          stockIds:
            "2880,2881,2882,2883,2884,2885,2886,2887,2889,2890,2891,2892,5880",
        }}
      >
        <Form.Item
          label={<span className="font-medium">股票代號</span>}
          name="stockIds"
          rules={[{ required: true, message: "請輸入股票代號" }]}
        >
          <Input.TextArea
            placeholder="請輸入股票代號，以逗號分隔&#10;例如: 2880,2881,2882&#10;支援金控股完整代號"
            className="w-full"
            rows={3}
            style={{
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span className="font-medium">年份</span>}
              name="year"
              rules={[{ required: true, message: "請選擇年份" }]}
            >
              <Select
                className="w-full"
                placeholder="選擇年份"
                style={{ borderRadius: "8px" }}
              >
                {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                  <Option key={year} value={year}>
                    {year}年
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={<span className="font-medium">月份</span>}
              name="month"
              rules={[{ required: true, message: "請選擇月份" }]}
            >
              <Select
                className="w-full"
                placeholder="選擇月份"
                style={{ borderRadius: "8px" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Option key={month} value={month}>
                    {month}月
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
            className="w-full h-12 text-base font-medium"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
            }}
          >
            {loading ? "查詢中..." : "🚀 開始查詢"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StockSelector;
