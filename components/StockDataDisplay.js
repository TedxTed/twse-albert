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

  // Stock name mapping
  const stockNameMap = {
    '2880': '華南金',
    '2881': '富邦金',
    '2882': '國泰金',
    '2883': '凱基金',
    '2884': '玉山金',
    '2885': '元大金',
    '2886': '兆豐金',
    '2887': '台新金',
    '2889': '國票金',
    '2890': '永豐金',
    '2891': '中信金',
    '2892': '第一金',
    '5880': '合庫金'
  };

  // Function to create a downloadable Excel file
  const downloadAsExcel = () => {
    // Create HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <title>Albert TWSE 自結搜尋結果</title>
        <style>
          body { 
            font-family: 微軟正黑體, Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
          }
          h1 {
            text-align: center;
            color: #1890ff;
            font-size: 28px;
            margin-bottom: 10px;
            border-bottom: 3px solid #1890ff;
            padding-bottom: 10px;
          }
          h2 {
            text-align: center;
            color: #666;
            font-size: 16px;
            margin-bottom: 40px;
          }
          h3 { 
            background: #e6f7ff; 
            padding: 15px; 
            margin: 40px 0 20px 0; 
            border-left: 4px solid #1890ff;
            color: #1890ff;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(24,144,255,0.1);
          }
          .stock-separator {
            margin: 40px 0;
            border: none;
            height: 2px;
            background: linear-gradient(to right, transparent, #1890ff, transparent);
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 15px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 10px; 
            text-align: left; 
          }
          th { 
            background-color: #f8f9fa; 
            font-weight: bold;
            color: #495057;
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          pre { 
            background: #f8f8f8; 
            padding: 15px; 
            border-radius: 4px; 
            overflow: auto;
            border: 1px solid #e9ecef;
          }
          .tblHead {
            background-color: #1890ff !important;
            color: white !important;
            font-weight: bold;
          }
          .odd {
            background-color: #fff !important;
          }
        </style>
      </head>
      <body>
        <h1>Albert TWSE 自結搜尋結果</h1>
        <h2>查詢股票：${stockData.map(s => s.id).join(', ')} （共 ${stockData.length} 檔）</h2>
        
        ${stockData
          .map((stock, index) => `
            ${index > 0 ? '<hr class="stock-separator">' : ''}
            <h3>股票代號: ${stock.id}${stock.name || stockNameMap[stock.id] ? ` - ${stock.name || stockNameMap[stock.id]}` : ''}</h3>
            ${stock.html}
          `)
          .join("")}
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
          {(stock.name || stockNameMap[stock.id]) && (
            <span className="text-gray-600">{stock.name || stockNameMap[stock.id]}</span>
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
