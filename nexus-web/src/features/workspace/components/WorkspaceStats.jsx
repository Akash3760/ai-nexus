import { useEffect, useState } from "react";
import {
    BrainCircuit,
    Files,
    Activity,
    FileText,
    TrendingUp,
} from "lucide-react";

import { getWorkspaceStats } from "@/services/workspaceService";

export default function AIWorkspaceStats() {
    const [stats, setStats] = useState({
        total_files: 0,
        completed_jobs: 0,
        running_jobs: 0,
        total_activities: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function loadStats() {
            try {
                const data = await getWorkspaceStats();

                if (!ignore) {
                    setStats(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadStats();

        return () => {
            ignore = true;
        };
    }, []);

    const cards = [
        {
            title: "Files Processed",
            value: stats.total_files,
            subtitle: "Documents analyzed",
            change: "Live from backend",
            icon: Files,
            iconClass: "bg-cyan-500/10 text-cyan-500",
            changeClass: "text-cyan-500",
        },
        {
            title: "Completed Jobs",
            value: stats.completed_jobs,
            subtitle: "Finished AI tasks",
            change: "Completed successfully",
            icon: BrainCircuit,
            iconClass: "bg-emerald-500/10 text-emerald-500",
            changeClass: "text-emerald-500",
        },
        {
            title: "Running Jobs",
            value: stats.running_jobs,
            subtitle: "Currently processing",
            change: "Real-time updates",
            icon: FileText,
            iconClass: "bg-amber-500/10 text-amber-500",
            changeClass: "text-amber-500",
        },
        {
            title: "Activity",
            value: stats.total_activities,
            subtitle: "Workspace activity",
            change: "Latest events",
            icon: Activity,
            iconClass: "bg-violet-500/10 text-violet-500",
            changeClass: "text-violet-500",
        },
    ];

    return (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => {
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
                                    {loading ? "--" : item.value}
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