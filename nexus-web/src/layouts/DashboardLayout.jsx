import { Outlet }
    from "react-router-dom";

import Navbar
    from "@/components/layout/Navbar";

export default function
    DashboardLayout() {
    return (
        <div className="min-h-screen bg-muted/30">

            <Navbar />

            <main className="mx-auto max-w-7xl p-6">
                <Outlet />
            </main>

        </div>
    );
}