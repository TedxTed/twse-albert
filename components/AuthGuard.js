// components/AuthGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Check if we're in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip if we're not mounted yet or if we're on the login page
    if (!mounted || router.pathname === '/login') {
      setLoading(false);
      return;
    }

    try {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      // If not logged in, redirect to login
      if (!isLoggedIn) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, redirect to login page
      router.push('/login');
    }
  }, [mounted, router]);

  // Server-side or initial render, don't apply any protection
  if (!mounted) {
    return children;
  }

  // Show loading spinner while checking auth
  if (loading && router.pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="驗證中..." />
      </div>
    );
  }
  
  // After auth check or on login page, render children
  return children;
};

export default AuthGuard;