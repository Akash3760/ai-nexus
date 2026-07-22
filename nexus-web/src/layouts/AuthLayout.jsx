import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (<div className="relative min-h-screen overflow-hidden bg-background">


        {/* Background Glow */}
        <div className="absolute left-[-200px] top-[-100px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

        <div className="absolute right-[-200px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[160px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center p-6">

            <div
                className="
                    grid
                    w-full
                    max-w-6xl
                    overflow-hidden
                    rounded-[40px]
                    border
                    border-border
                    bg-card
                    shadow-2xl
                    lg:grid-cols-2
                "
            >

                {/* LEFT SIDE */}
                <div
                    className="
                        hidden
                        flex-col
                        justify-center
                        border-r
                        border-border
                        p-14
                        lg:flex
                    "
                >

                    <span className="mb-6 w-fit rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                        Enterprise AI Platform
                    </span>

                    <h1 className="text-6xl font-bold">
                        AI
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {" "}Nexus
                        </span>
                    </h1>

                    <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
                        Build intelligent AI workspaces, automate workflows,
                        and scale your organization with the power
                        of artificial intelligence.
                    </p>

                    <div className="mt-10 space-y-5">

                        <div className="flex items-center gap-3">
                            <span className="text-cyan-400">✓</span>
                            <span>AI workspaces</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-cyan-400">✓</span>
                            <span>Workflow Automation</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-cyan-400">✓</span>
                            <span>Team Collaboration</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-cyan-400">✓</span>
                            <span>Enterprise Security</span>
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div
                    className="
                        flex
                        items-center
                        justify-center
                        p-8
                        lg:p-14
                    "
                >

                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>

                </div>

            </div>

        </div>

    </div>
    );

}
