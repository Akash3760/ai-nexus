import { Link } from "react-router-dom";
import {
    BrainCircuit,
    Files,
    FileText,
    Workflow,
    Brain,
    BarChart3,
    Users,
    Settings,
    ArrowRight,
    Sparkles,
    Activity,
    ShieldCheck,
    Database,
    Clock3,
    Plus,
    Zap,
    Cpu,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";

const stats = [
    {
        title: "Files Processed",
        value: "--",
        change: "Waiting for backend",
        icon: Files,
    },
    {
        title: "AI Sessions",
        value: "--",
        change: "Live statistics",
        icon: BrainCircuit,
    },
    {
        title: "Reports Generated",
        value: "--",
        change: "Backend pending",
        icon: FileText,
    },
    {
        title: "Requests Today",
        value: "--",
        change: "Real-time",
        icon: Activity,
    },
];

const modules = [
    {
        title: "AI Workspace",
        description:
            "Analyze files, generate reports, explore insights, and access AI-powered productivity tools.",
        icon: BrainCircuit,
        to: "/dashboard/workspace",
    },
    {
        title: "Workflows",
        description:
            "Create multi-step automation pipelines that connect AI, data, and business processes.",
        icon: Workflow,
        to: "/dashboard/workflows",
    },
    {
        title: "Knowledge Base",
        description:
            "Centralize documents, prompts, and business knowledge for smarter AI responses.",
        icon: Brain,
        to: "/dashboard/knowledge",
    },
    {
        title: "Analytics",
        description:
            "Track AI usage, workflow performance, success rates, and operational insights.",
        icon: BarChart3,
        to: "/dashboard/analytics",
    },
    {
        title: "Team Workspace",
        description:
            "Collaborate with teams, manage roles, and organize work across your AI workspace.",
        icon: Users,
        to: "/dashboard/team",
    },
    {
        title: "Settings",
        description:
            "Configure workspace preferences, security, integrations, and platform controls.",
        icon: Settings,
        to: "/dashboard/settings",
    },
];

const recentActivity = [
    {
        title: "Spreadsheet analysis completed successfully",
        time: "10 min ago",
        icon: BrainCircuit,
    },
    {
        title: "AI report generated successfully",
        time: "32 min ago",
        icon: Workflow,
    },
    {
        title: "New document uploaded for AI analysis",
        time: "1 hour ago",
        icon: Database,
    },
    {
        title: "Workspace usage report generated",
        time: "2 hours ago",
        icon: BarChart3,
    },
];

const quickActions = [
    {
        title: "Open Workspace",
        icon: BrainCircuit,
        to: "/dashboard/workspace",
    },
    {
        title: "New Workflow",
        icon: Workflow,
        to: "/dashboard/workflows",
    },
    {
        title: "Upload File",
        icon: Brain,
        to: "/dashboard/knowledge",
    },
    {
        title: "Workspace Settings",
        icon: Settings,
        to: "/dashboard/settings",
    },
];

export default function Dashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8">

            {/* HERO */}
            <section
                className="
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-border
                    bg-card
                    p-8
                    shadow-sm
                    lg:p-10
                "
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

                <div className="relative grid gap-8 xl:grid-cols-[1.35fr_0.85fr]">

                    {/* LEFT HERO CONTENT */}
                    <div>
                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-border
                                bg-background/80
                                px-4
                                py-2
                                text-sm
                                text-muted-foreground
                                backdrop-blur
                            "
                        >
                            <Sparkles className="h-4 w-4 text-cyan-500" />
                            AI Nexus Workspace
                        </div>

                        <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
                            Welcome back,{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                {user?.username || "User"}
                            </span>
                        </h1>

                        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                            Analyze spreadsheets, PDFs, documents, and images, generate AI-powered reports, and manage your AI workspace from one intelligent platform.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button
                                asChild
                                className="h-12 rounded-xl px-6"
                            >
                                <Link to="/dashboard/workspace">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Open Workspace
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="h-12 rounded-xl px-6"
                            >
                                <Link to="/dashboard/workflows">
                                    New Workflow
                                </Link>
                            </Button>
                        </div>

                        {/* MINI HIGHLIGHTS */}
                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-500">
                                        <Zap className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Fast Automation
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Analyze files with AI
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-500">
                                        <Brain className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Smart Knowledge
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Process spreadsheets, PDFs and documents
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Secure Workspace
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Secure AI-powered workspace
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT HERO PANEL */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-3xl border border-border bg-background/80 p-5 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-500">
                                    <Activity className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        System Health
                                    </p>

                                    <p className="font-semibold">
                                        Operational
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-border bg-background/80 p-5 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                                    <Cpu className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        AI Processing
                                    </p>

                                    <p className="font-semibold">
                                        18 Active Jobs
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-border bg-background/80 p-5 backdrop-blur sm:col-span-2 xl:col-span-1">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Security Status
                                    </p>

                                    <p className="font-semibold">
                                        Protected & Synced
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* STATS */}
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="
                                rounded-3xl
                                border
                                border-border
                                bg-card
                                p-6
                                shadow-sm
                            "
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {item.title}
                                    </p>

                                    <h3 className="mt-3 text-3xl font-bold tracking-tight">
                                        {item.value}
                                    </h3>
                                </div>

                                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-500">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-muted-foreground">
                                {item.change}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* MODULES + RIGHT SIDE */}
            <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">

                {/* MODULE GRID */}
                <div className="rounded-[32px] border border-border bg-card p-6 shadow-sm lg:p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">
                            Workspace Modules
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Navigate through the core systems of your AI workspace.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {modules.map((module) => {
                            const Icon = module.icon;

                            return (
                                <Link
                                    key={module.title}
                                    to={module.to}
                                    className="
                                        group
                                        rounded-3xl
                                        border
                                        border-border
                                        bg-background
                                        p-6
                                        transition-all
                                        hover:-translate-y-1
                                        hover:border-cyan-500/40
                                        hover:shadow-lg
                                    "
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-500 transition-colors group-hover:bg-cyan-500/15">
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                                    </div>

                                    <h3 className="mt-5 text-xl font-semibold">
                                        {module.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                        {module.description}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">

                    {/* QUICK ACTIONS */}
                    <div className="rounded-[32px] border border-border bg-card p-6 shadow-sm">
                        <h2 className="text-xl font-bold">
                            Quick Actions
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Jump directly into your most important workspace actions.
                        </p>

                        <div className="mt-6 space-y-3">
                            {quickActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <Link
                                        key={action.title}
                                        to={action.to}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-background
                                            px-4
                                            py-4
                                            transition-colors
                                            hover:border-cyan-500/40
                                            hover:bg-muted/40
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-500">
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <span className="font-medium">
                                                {action.title}
                                            </span>
                                        </div>

                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* SYSTEM OVERVIEW */}
                    <div className="rounded-[32px] border border-border bg-card p-6 shadow-sm">
                        <h2 className="text-xl font-bold">
                            Workspace Overview
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    AI Services
                                </span>

                                <span className="font-medium text-green-500">
                                    Healthy
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Processing Queue
                                </span>

                                <span className="font-medium">
                                    18 Active Jobs
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    API Usage
                                </span>

                                <span className="font-medium">
                                    Last updated 12 min ago
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    API Usage
                                </span>

                                <span className="font-medium">
                                    72% of monthly limit
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section className="rounded-[32px] border border-border bg-card p-6 shadow-sm lg:p-8">
                <div>
                    <h2 className="text-2xl font-bold">
                        Recent Activity
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Track recent uploads, AI analyses, generated reports, and workspace activity.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    {recentActivity.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="
                                    flex
                                    items-start
                                    gap-4
                                    rounded-2xl
                                    border
                                    border-border
                                    bg-background
                                    p-4
                                "
                            >
                                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-500">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium">
                                        {item.title}
                                    </p>

                                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock3 className="h-4 w-4" />
                                        {item.time}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

        </div>
    );
}