import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import ClientDashboard from '../components/dashboard/ClientDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user?.userType === 'student' ? <StudentDashboard /> : <ClientDashboard />}
    </div>
  );
};

export default Dashboard;