import { Settings, ShieldCheck } from "lucide-react";

export default function SettingsHeader() {
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
            "
        >
            {/* Background Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
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
                        <Settings className="h-4 w-4 text-cyan-500" />
                        Workspace Configuration
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
                        Settings
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                        Manage your profile, security, workspace, integrations,
                        AI preferences, and platform settings from one central
                        place.
                    </p>
                </div>

                {/* Right */}
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
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-500">
                            <ShieldCheck className="h-6 w-6" />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Security Status
                            </p>

                            <p className="font-semibold">
                                Workspace Protected
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}