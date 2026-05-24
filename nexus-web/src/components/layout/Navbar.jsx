import { Link } from "react-router-dom";

import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
    return (
        <nav className="border-b bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    to="/"
                    className="text-xl font-bold"
                >
                    AI Nexus
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}