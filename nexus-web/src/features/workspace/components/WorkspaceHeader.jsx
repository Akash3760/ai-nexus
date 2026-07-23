import { Link } from "react-router-dom";
import {
    BrainCircuit,
    Sparkles,
    ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AIWorkspaceHeader() {
    return (
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
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_35%)]" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
                <div className="max-w-3xl">
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
                        AI Workspace
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                        <div
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-3xl
                                bg-cyan-500/10
                                text-cyan-500
                            "
                        >
                            <BrainCircuit className="h-8 w-8" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                AI Workspace
                            </h1>

                            <p className="mt-2 max-w-2xl text-muted-foreground">
                                Upload files, analyze documents, generate
                                reports, summarize content, automate workflows,
                                and unlock AI-powered productivity from one
                                workspace.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button
                            asChild
                            className="h-12 rounded-xl px-6"
                        >
                            <Link to="/dashboard/workspace/files">
                                Browse Files
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            asChild
                            className="h-12 rounded-xl px-6"
                        >
                            <Link to="/dashboard/workspace/history">
                                Recent Activity
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right */}
                <div className="grid gap-4 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1">
                    <StatCard
                        title="Files Processed"
                        value="--"
                        subtitle="Live from backend"
                    />

                    <StatCard
                        title="AI Sessions"
                        value="--"
                        subtitle="Updated in real time"
                    />

                    <StatCard
                        title="Reports Generated"
                        value="--"
                        subtitle="AI-generated insights"
                    />
                </div>
            </div>
        </section>
    );
}

function StatCard({ title, value, subtitle }) {
    return (
        <div
            className="
                rounded-3xl
                border
                border-border
                bg-background/80
                p-5
                backdrop-blur
            "
        >
            <p className="text-sm text-muted-foreground">
                {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold">
                {value}
            </h3>

            <p className="mt-1 text-sm text-cyan-500">
                {subtitle}
            </p>
        </div>
    );
}