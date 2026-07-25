import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "@/app/ProtectedRoute";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";

import Workspace from "@/features/workspace/pages/Workspace";
import FilePreview from "@/features/workspace/pages/FilePreview";
import Settings from "@/features/settings/pages/Settings";

const router = createBrowserRouter([
    // Public
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

    // Authentication
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

    // Protected
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

            // Settings
            {
                path: "settings",
                element: <Settings />,
            },

            // Workspace
            {
                path: "workspace",
                element: <Workspace />,
            },
            {
                path: "workspace/files/:id",
                element: <FilePreview />,
            },
            {
                path: "workspace/upload",
                element: <Workspace />,
            },
            {
                path: "workspace/history",
                element: <Workspace />,
            },
            {
                path: "workspace/files",
                element: <Workspace />,
            },
            {
                path: "workspace/spreadsheet",
                element: <Workspace />,
            },
            {
                path: "workspace/pdf",
                element: <Workspace />,
            },
            {
                path: "workspace/image",
                element: <Workspace />,
            },
            {
                path: "workspace/report",
                element: <Workspace />,
            },
            {
                path: "workspace/workflow",
                element: <Workspace />,
            },
            {
                path: "workspace/chat",
                element: <Workspace />,
            },
        ],
    },

    // 404
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;