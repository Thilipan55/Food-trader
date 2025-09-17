// src/dashboard/DashboardRouter.jsx (UPDATED)

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import DonorDashboard from './DonorDashboard';
import RecipientDashboard from './RecipientDashboard';

const DashboardRouter = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [userRole, setUserRole] = useState(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (!user?.sub) {
                setIsRoleLoading(false);
                return;
            }
            try {
                // 👇 NEW: Make a GET request to your backend using the user's sub
                const response = await fetch(`http://localhost:3001/api/users/${user.sub}`);
                if (response.status === 404) {
                    setUserRole(null); // User not found, needs to select a role
                } else if (!response.ok) {
                    throw new Error('Failed to fetch user role');
                } else {
                    const data = await response.json();
                    setUserRole(data.role);
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                // Handle error
            } finally {
                setIsRoleLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserRole();
        } else {
            setIsRoleLoading(false);
        }
    }, [isAuthenticated, user]);

    if (isLoading || isRoleLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (!userRole) {
        return <Navigate to="/select-role" />;
    }

    if (userRole === 'donor') {
        return <DonorDashboard />;
    } else if (userRole === 'recipient') {
        return <RecipientDashboard />;
    } else {
        return <div>Invalid user role.</div>;
    }
};

export default DashboardRouter;