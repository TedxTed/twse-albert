// components/StockDataDisplay.js
import { useState } from "react";
import { Collapse, Card, Button, message, Spin, Empty, Badge } from "antd";
import { FileExcelOutlined, CaretRightOutlined } from "@ant-design/icons";

const StockDataDisplay = ({ stockData, loading }) => {
  const [activeKeys, setActiveKeys] = useState([]);

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
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">{stock.id}</span>
          {stock.name && (
            <span className="text-gray-600">{stock.name}</span>
          )}
        </div>
        <Badge 
          status={stock.hasData ? "success" : "error"} 
          text={stock.hasData ? "有資料" : "無資料"}
        />
      </div>
    ),
    children: (
      <div className="overflow-x-auto bg-gray-50 p-4 rounded">
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
      title={
        <div className="flex items-center justify-between">
          <span>股票資料查詢結果</span>
          <span className="text-sm text-gray-500">
            共 {stockData.length} 檔股票，{stockData.filter(s => s.hasData).length} 檔有資料
          </span>
        </div>
      }
      extra={
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => setActiveKeys(stockData.map((_, i) => String(i)))}
          >
            全部展開
          </Button>
          <Button
            size="small" 
            onClick={() => setActiveKeys([])}
          >
            全部收合
          </Button>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={downloadAsExcel}
          >
            下載為 Excel
          </Button>
        </div>
      }
    >
      <Collapse
        activeKey={activeKeys}
        onChange={setActiveKeys}
        items={items}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="bg-white"
        ghost
      />
    </Card>
  );
};

export default StockDataDisplay;
