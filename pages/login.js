// pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Head from "next/head";
import Image from "next/image";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Make sure app is running in browser before proceeding
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const onFinish = async (values) => {
    if (!isBrowser) return;

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

  // Only render the form if we're in the browser
  if (!isBrowser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <Head>
          <title>登入 - Albert的個人系統</title>
          <meta name="description" content="登入系統" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Spin size="large" tip="載入中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Head>
        <title>登入 - Albert的個人系統</title>
        <meta name="description" content="Albert的個人系統登入頁面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {/* Replace with Albert's logo or avatar if available */}
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              A
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">歡迎回來</h2>
          <p className="mt-2 text-sm text-gray-600">登入Albert的個人系統</p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm space-y-4">
            <Form.Item
              name="username"
              rules={[{ required: true, message: "請輸入用戶名！" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用戶名"
                size="large"
                className="rounded-lg"
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
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <a className="text-sm text-blue-600 hover:text-blue-800" href="#">
                忘記密碼?
              </a>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-3 h-12 text-base rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              size="large"
              loading={loading}
            >
              登入
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Albert的個人系統 - 版權所有
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
