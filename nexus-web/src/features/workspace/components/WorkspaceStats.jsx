import {
    BrainCircuit,
    Files,
    Activity,
    FileText,
    TrendingUp,
} from "lucide-react";

const stats = [
    {
        title: "Files Processed",
        value: "--",
        subtitle: "Documents analyzed",
        change: "Waiting for backend",
        icon: Files,
        iconClass: "bg-cyan-500/10 text-cyan-500",
        changeClass: "text-cyan-500",
    },
    {
        title: "AI Sessions",
        value: "--",
        subtitle: "Completed conversations",
        change: "Live statistics",
        icon: BrainCircuit,
        iconClass: "bg-emerald-500/10 text-emerald-500",
        changeClass: "text-emerald-500",
    },
    {
        title: "Reports Generated",
        value: "--",
        subtitle: "AI-generated outputs",
        change: "Backend pending",
        icon: FileText,
        iconClass: "bg-amber-500/10 text-amber-500",
        changeClass: "text-amber-500",
    },
    {
        title: "Requests Today",
        value: "--",
        subtitle: "Today's AI requests",
        change: "Real-time",
        icon: Activity,
        iconClass: "bg-violet-500/10 text-violet-500",
        changeClass: "text-violet-500",
    },
];

export default function AIWorkspaceStats() {
    return (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="
                            group
                            rounded-[28px]
                            border
                            border-border
                            bg-card
                            p-6
                            shadow-sm
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:border-cyan-500/30
                            hover:shadow-lg
                        "
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {item.title}
                                </p>

                                <h2 className="mt-3 text-4xl font-bold tracking-tight">
                                    {item.value}
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {item.subtitle}
                                </p>
                            </div>

                            <div
                                className={`
                                    rounded-2xl
                                    p-3
                                    transition-transform
                                    duration-300
                                    group-hover:scale-110
                                    ${item.iconClass}
                                `}
                            >
                                <Icon className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                            <TrendingUp
                                className={`h-4 w-4 ${item.changeClass}`}
                            />

                            <span
                                className={`text-sm font-medium ${item.changeClass}`}
                            >
                                {item.change}
                            </span>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}