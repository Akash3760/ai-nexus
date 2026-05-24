import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";

import Home
    from "@/pages/Home";

import Login
    from "@/pages/Login";

import Register
    from "@/pages/Register";

import Dashboard
    from "@/pages/Dashboard";

import AuthLayout
    from "@/layouts/AuthLayout";

import DashboardLayout
    from "@/layouts/DashboardLayout";

import ProtectedRoute
    from "@/app/ProtectedRoute";

import NotFound
    from "@/pages/NotFound";

const router =
    createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },

        // Auth pages
        {
            element:
                <AuthLayout />,
            children: [
                {
                    path: "/login",
                    element:
                        <Login />,
                },

                {
                    path:
                        "/register",
                    element:
                        <Register />,
                },
            ],
        },

        // Protected pages
        {
            element: (
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            ),

            children: [
                {
                    path: "/dashboard",
                    element: <Dashboard />,
                },
            ],
        },

        {
            path: "*",
            element: <NotFound />,
        },
    ]);

export default router;