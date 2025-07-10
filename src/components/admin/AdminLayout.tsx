import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const flag = localStorage.getItem('adminLoggedIn') === 'true';
    setIsAuthorized(flag);
  }, []);

  if (isAuthorized === null) return null; // still loading

  if (!isAuthorized) {
    return <Navigate to="/nikunj" replace />;
  }

  return (
    <div className="admin-layout bg-slate-900 min-h-screen">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
