import {
    createBrowserRouter,
} from "react-router-dom";

import ProtectedRoute from "@/components/common/ProtectedRoute";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,

        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },

    {
        path: "/",
        element: <AuthLayout />,

        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
        ],
    },

    {
        path: "/dashboard",

        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),

        children: [
            {
                index: true,
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