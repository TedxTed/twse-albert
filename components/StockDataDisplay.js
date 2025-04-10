// components/StockDataDisplay.js
import { useState } from "react";
import { Tabs, Card, Button, message, Spin, Empty } from "antd";
import { DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";

const StockDataDisplay = ({ stockData, loading }) => {
  const [activeKey, setActiveKey] = useState("0");

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="載入中..." />
      </div>
    );
  }

  if (!stockData || stockData.length === 0) {
    return <Empty description="尚無資料，請使用上方的表單查詢股票資料" />;
  }

  // Function to create a downloadable Excel file
  const downloadAsExcel = () => {
    // Create HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <title>TWSE Data</title>
        <style>body { font-family: Arial; }</style>
      </head>
      <body>
        ${stockData
          .map((stock) => `<p>stock id: ${stock.id}</p>${stock.html}`)
          .join("<br/><br/>")}
      </body>
      </html>
    `;

    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the filename with current date and time
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0].replace(/:/g, "");
    link.download = `twse_data_${date}_${time}.xls`;

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success("資料已下載");
  };

  const items = stockData.map((stock, index) => ({
    key: String(index),
    label: (
      <span className="flex items-center gap-1">
        <span className="font-bold">{stock.id}</span>
        {stock.name && (
          <span className="text-gray-500 text-sm">({stock.name})</span>
        )}
      </span>
    ),
    children: (
      <div className="overflow-x-auto">
        {stock.hasData ? (
          <div dangerouslySetInnerHTML={{ __html: stock.html }} />
        ) : (
          <Empty description={`股票代號 ${stock.id} 無資料`} />
        )}
      </div>
    ),
  }));

  return (
    <Card
      className="shadow-md"
      title="股票資料查詢結果"
      extra={
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={downloadAsExcel}
        >
          下載為 Excel
        </Button>
      }
    >
      <Tabs
        type="card"
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        className="min-h-64"
      />
    </Card>
  );
};

export default StockDataDisplay;
