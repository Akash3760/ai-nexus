import {
    createBrowserRouter,
} from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

import ProtectedRoute
    from "@/app/ProtectedRoute";

const router =
    createBrowserRouter([
        {
            path: "/",
            element: <Login />,
        },

        {
            path: "/login",
            element: <Login />,
        },

        {
            path: "/dashboard",
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
    ]);

export default router;