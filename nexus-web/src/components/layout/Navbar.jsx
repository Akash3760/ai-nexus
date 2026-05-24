import {
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";

import ThemeToggle
    from "@/components/common/ThemeToggle";

import { Button }
    from "@/components/ui/button";

import useAuthStore
    from "@/store/authStore";

import {
    logout as logoutService,
} from "@/services/authService";

export default function Navbar() {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        user,
        logout,
    } = useAuthStore();

    const isHomePage =
        location.pathname === "/";

    const handleLogout =
        () => {
            logoutService();

            logout();

            navigate("/login");
        };

    return (
        <nav className="border-b bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                <Link
                    to={
                        user
                            ? "/dashboard"
                            : "/"
                    }
                    className="text-xl font-bold"
                >
                    AI Nexus
                </Link>

                <div className="flex items-center gap-4">

                    {user ? (
                        <>
                            <div className="text-right">
                                <p className="font-medium">
                                    {
                                        user?.username
                                    }
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {
                                        user?.email
                                    }
                                </p>
                            </div>

                            <Button
                                variant="destructive"
                                onClick={
                                    handleLogout
                                }
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                            >
                                Login
                            </Link>

                            {isHomePage && (
                                <Button
                                    asChild
                                >
                                    <Link
                                        to="/register"
                                    >
                                        Register
                                    </Link>
                                </Button>
                            )}
                        </>
                    )}

                    <ThemeToggle />

                </div>
            </div>
        </nav>
    );
}