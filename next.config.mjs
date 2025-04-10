// next.config.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const withTM = require("next-transpile-modules")([
  "antd",
  "@ant-design/icons",
  "rc-util",
]);

export default withTM({
  reactStrictMode: true,
  webpack(config) {
    // Fix for rc-util missing module
    config.resolve.alias = {
      ...config.resolve.alias,
      "@ant-design/icons/lib": "@ant-design/icons/lib/index.js",
      "rc-util": require.resolve("rc-util"), // Ensure correct resolution of rc-util
    };

    return config;
  },
});
