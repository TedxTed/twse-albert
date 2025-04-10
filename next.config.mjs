const withTM = require("next-transpile-modules")([
  "antd",
  "@ant-design/icons",
  "rc-util",
]);

module.exports = withTM({
  reactStrictMode: true,
  webpack: (config) => {
    // Fix for rc-util missing module
    config.resolve.alias = {
      ...config.resolve.alias,
      "@ant-design/icons/lib": "@ant-design/icons/lib/index.js",
      "rc-util/es/Dom/canUseDom": "rc-util/lib/Dom/canUseDom",
    };
    return config;
  },
});
