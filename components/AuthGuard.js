// components/AuthGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && router.pathname !== '/login') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="驗證中..." />
      </div>
    );
  }
  
  // If on login page or authenticated, render children
  return router.pathname === '/login' || !loading ? children : null;
};

export default AuthGuard;