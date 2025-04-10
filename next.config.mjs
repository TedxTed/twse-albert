// next.config.mjs
export default {
  reactStrictMode: true,
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "rc-util",
    "@rc-component/portal",
    "@rc-component/trigger",
    "rc-picker",
  ],
  output: "standalone", // 需要 Next.js 12.3+
};
