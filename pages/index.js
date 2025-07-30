// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to TWSE search page
    router.replace("/twse-search");
  }, [router]);

  return null;
}