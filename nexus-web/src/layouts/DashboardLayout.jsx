import { useState } from "react";
import {
    Link,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    LayoutDashboard,
    Bot,
    Workflow,
    Brain,
    BarChart3,
    Users,
    Settings,
    Camera,
    LogOut,
    Sparkles,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import { logout as logoutService } from "@/services/authService";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";

const navItems = [
    {
        title: "Overview",
        icon: LayoutDashboard,
        to: "/dashboard",
    },
    {
        title: "AI Workspace",
        icon: Bot,
        to: "/dashboard/workspace",
    },
    {
        title: "Vision Studio",
        icon: Camera,
        to: "/dashboard/vision",
    },
    {
        title: "Workflows",
        icon: Workflow,
        to: "/dashboard/workflows",
    },
    {
        title: "Knowledge",
        icon: Brain,
        to: "/dashboard/knowledge",
    },
    {
        title: "Analytics",
        icon: BarChart3,
        to: "/dashboard/analytics",
    },
    {
        title: "Team",
        icon: Users,
        to: "/dashboard/team",
    },
    {
        title: "Settings",
        icon: Settings,
        to: "/dashboard/settings",
    },
];

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const { user, logout } = useAuthStore();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleLogout = () => {
        logoutService();
        logout();
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard";
        }

        return location.pathname.startsWith(path);
    };

    const currentPage =
        navItems.find((item) => isActive(item.to)) || navItems[0];

    const handleMobileNavigate = () => {
        setMobileSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* BACKGROUND GLOW */}
            <div className="pointer-events-none fixed left-[-200px] top-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[160px]" />
            <div className="pointer-events-none fixed right-[-220px] top-[120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[160px]" />

            <div className="relative flex min-h-screen">

                {/* MOBILE OVERLAY */}
                {mobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}

                {/* DESKTOP SIDEBAR */}
                <aside
                    className={`
                        hidden
                        fixed
                        left-0
                        top-0
                        z-40
                        h-screen
                        shrink-0
                        border-r
                        border-border
                        bg-card/70
                        backdrop-blur
                        transition-all
                        duration-300
                        lg:flex
                        lg:flex-col
                        ${collapsed ? "w-[96px]" : "w-[290px]"}
                    `}
                >
                    {/* TOP / LOGO */}
                    <div className="shrink-0 border-b border-border px-4 py-4">
                        <div
                            className={`
                                flex
                                items-center
                                ${collapsed ? "justify-center" : "justify-between"}
                            `}
                        >
                            <Link
                                to="/dashboard"
                                className={`
                                    flex
                                    items-center
                                    gap-3
                                    overflow-hidden
                                    ${collapsed ? "justify-center" : ""}
                                `}
                            >
                                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-500">
                                    <Sparkles className="h-5 w-5" />
                                </div>

                                {!collapsed && (
                                    <div>
                                        <h1 className="text-lg font-bold">
                                            AI Nexus
                                        </h1>

                                        <p className="text-sm text-muted-foreground">
                                            Workspace
                                        </p>
                                    </div>
                                )}
                            </Link>

                            {!collapsed && (
                                <button
                                    type="button"
                                    onClick={() => setCollapsed(true)}
                                    className="
                                        rounded-xl
                                        border
                                        border-border
                                        p-2
                                        text-muted-foreground
                                        transition-colors
                                        hover:bg-muted
                                        hover:text-foreground
                                    "
                                >
                                    <PanelLeftClose className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {collapsed && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setCollapsed(false)}
                                    className="
                                        rounded-xl
                                        border
                                        border-border
                                        p-2
                                        text-muted-foreground
                                        transition-colors
                                        hover:bg-muted
                                        hover:text-foreground
                                    "
                                >
                                    <PanelLeftOpen className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* NAV */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
                        {!collapsed && (
                            <p className="px-3 pb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
                                Platform
                            </p>
                        )}

                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.to);

                                return (
                                    <Link
                                        key={item.title}
                                        to={item.to}
                                        title={collapsed ? item.title : ""}
                                        className={`
                                            flex
                                            items-center
                                            rounded-2xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            transition-all
                                            ${collapsed ? "justify-center" : "gap-3"}
                                            ${active
                                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }
                                        `}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />

                                        {!collapsed && (
                                            <span>{item.title}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* MOBILE SIDEBAR */}
                <aside
                    className={`
                        fixed
                        inset-y-0
                        left-0
                        z-50
                        w-[290px]
                        border-r
                        border-border
                        bg-card
                        backdrop-blur
                        transition-transform
                        duration-300
                        lg:hidden
                        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
                >
                    {/* MOBILE TOP */}
                    <div className="border-b border-border px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                to="/dashboard"
                                onClick={handleMobileNavigate}
                                className="flex items-center gap-3"
                            >
                                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-500">
                                    <Sparkles className="h-5 w-5" />
                                </div>

                                <div>
                                    <h1 className="text-lg font-bold">
                                        AI Nexus
                                    </h1>

                                    <p className="text-sm text-muted-foreground">
                                        Workspace
                                    </p>
                                </div>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(false)}
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    p-2
                                    text-muted-foreground
                                    transition-colors
                                    hover:bg-muted
                                    hover:text-foreground
                                "
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* MOBILE NAV */}
                    <div className="overflow-y-auto px-3 py-6">
                        <p className="px-3 pb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
                            Platform
                        </p>

                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.to);

                                return (
                                    <Link
                                        key={item.title}
                                        to={item.to}
                                        onClick={handleMobileNavigate}
                                        className={`
                                            flex
                                            items-center
                                            gap-3
                                            rounded-2xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            transition-all
                                            ${active
                                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }
                                        `}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* MAIN */}
                <div
                    className={`
                        flex
                        min-h-screen
                        flex-1
                        flex-col
                        transition-all
                        duration-300
                        ${collapsed ? "lg:ml-[96px]" : "lg:ml-[290px]"}
                    `}
                >

                    {/* TOP BAR */}
                    <header
                        className="
                            sticky
                            top-0
                            z-30
                            border-b
                            border-border
                            bg-background/80
                            backdrop-blur
                        "
                    >
                        <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10">

                            {/* LEFT */}
                            <div className="flex items-center gap-3">

                                {/* MOBILE MENU BUTTON */}
                                <button
                                    type="button"
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-card
                                        text-muted-foreground
                                        transition-colors
                                        hover:bg-muted
                                        hover:text-foreground
                                        lg:hidden
                                    "
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Dashboard
                                    </p>

                                    <h2 className="text-xl font-bold sm:text-2xl">
                                        {currentPage.title}
                                    </h2>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-3">

                                {/* USER CARD */}
                                <div
                                    className="
                                        hidden
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-card/70
                                        px-3
                                        py-2
                                        backdrop-blur
                                        md:flex
                                    "
                                >
                                    <div className="text-right">
                                        <p className="max-w-[140px] truncate text-sm font-semibold leading-none">
                                            {user?.username || "Admin"}
                                        </p>

                                        <p className="mt-1 max-w-[180px] truncate text-xs text-muted-foreground">
                                            {user?.email || "No email"}
                                        </p>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-cyan-500/10
                                            text-sm
                                            font-semibold
                                            text-cyan-500
                                        "
                                    >
                                        {user?.username?.charAt(0)?.toUpperCase() || "A"}
                                    </div>
                                </div>

                                {/* MOBILE USER AVATAR */}
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-card/70
                                        text-sm
                                        font-semibold
                                        md:hidden
                                    "
                                >
                                    {user?.username?.charAt(0)?.toUpperCase() || "A"}
                                </div>

                                {/* ACTIONS CARD */}
                                <div
                                    className="
                                        flex
                                        items-center
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-card/70
                                        p-1.5
                                        backdrop-blur
                                    "
                                >
                                    {/* THEME TOGGLE */}
                                    <ThemeToggle />

                                    {/* DIVIDER */}
                                    <div className="mx-1 h-6 w-px bg-border" />

                                    {/* DESKTOP LOGOUT */}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="
                                            hidden
                                            h-10
                                            items-center
                                            gap-2
                                            rounded-xl
                                            px-3
                                            text-sm
                                            font-medium
                                            text-red-500
                                            transition-colors
                                            hover:bg-red-500/10
                                            md:flex
                                        "
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>

                                    {/* MOBILE LOGOUT */}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            text-red-500
                                            transition-colors
                                            hover:bg-red-500/10
                                            md:hidden
                                        "
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
                        <Outlet />
                    </main>

                </div>
            </div>
        </div>
    );
}