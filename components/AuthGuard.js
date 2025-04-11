// components/AuthGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin, Layout } from 'antd';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Check if we're in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip if we're not mounted yet
    if (!mounted) {
      return;
    }

    try {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      // If not logged in and not on login page, redirect to login
      if (!isLoggedIn && router.pathname !== '/login') {
        router.push('/login');
      } 
      
      // Otherwise allow access and stop loading
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, redirect to login page
      router.push('/login');
      setLoading(false);
    }
  }, [mounted, router]);

  // Server-side rendering, return empty layout
  if (!mounted) {
    return <Layout className="min-h-screen bg-gray-50" />;
  }

  // Always show loading spinner until auth check is complete
  if (loading) {
    return (
      <Layout className="min-h-screen">
        <div className="flex items-center justify-center h-full min-h-screen">
          <Spin size="large" tip="驗證中..." />
        </div>
      </Layout>
    );
  }
  
  // After auth check completes, render children
  return children;
};

export default AuthGuard;