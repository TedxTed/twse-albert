// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Head from "next/head";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Store login status in localStorage
        localStorage.setItem("isLoggedIn", "true");

        message.success("登入成功！");
        router.push("/");
      } else {
        message.error(data.message || "登入失敗，請檢查用戶名和密碼");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("登入過程中發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head>
        <title>登入 - 台灣證券交易所資料查詢系統</title>
        <meta name="description" content="登入系統" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card
        title="登入系統 (僅供 Albert 使用)"
        className="w-full max-w-md shadow-md"
        extra={
          <span className="text-gray-500 text-sm">
            台灣證券交易所資料查詢系統
          </span>
        }
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "請輸入用戶名！" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用戶名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "請輸入密碼！" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密碼"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={loading}
            >
              登入
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
