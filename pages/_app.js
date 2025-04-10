// pages/_app.js
import "antd/dist/reset.css";
import "../styles/globals.css";
import AuthGuard from "../components/AuthGuard";

function MyApp({ Component, pageProps }) {
  return (
    <AuthGuard>
      <Component {...pageProps} />
    </AuthGuard>
  );
}

export default MyApp;
