import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Upload,
    BrainCircuit,
    FileText,
    CheckCircle2,
    Clock3,
    Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getRecentActivity } from "@/services/workspaceService";

const iconMap = {
    upload: {
        icon: Upload,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
    analysis: {
        icon: BrainCircuit,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
    report: {
        icon: FileText,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    workflow: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    default: {
        icon: Activity,
        color: "text-slate-500",
        bg: "bg-slate-500/10",
    },
};

function formatTime(date) {
    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function RecentActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function loadActivity() {
            try {
                const data = await getRecentActivity();

                if (!ignore) {
                    setActivities(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadActivity();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Recent Activity
                    </h2>

                    <p className="mt-1 text-muted-foreground">
                        Track everything happening across your AI workspace.
                    </p>
                </div>

                <Link
                    to="/dashboard/workspace/history"
                    className="text-sm font-medium text-cyan-500 hover:underline"
                >
                    View History
                </Link>
            </div>

            <div className="rounded-2xl border bg-card p-6">
                {loading ? (
                    <div className="py-10 text-center text-muted-foreground">
                        Loading activity...
                    </div>
                ) : activities.length === 0 ? (
                    <div className="py-10 text-center text-muted-foreground">
                        No recent activity.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activities.map((activity, index) => {
                            const config =
                                iconMap[activity.action] ??
                                iconMap.default;

                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{
                                        opacity: 0,
                                        x: -20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        duration: 0.35,
                                        delay: index * 0.08,
                                    }}
                                    className="flex gap-4"
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-full
                                                ${config.bg}
                                            `}
                                        >
                                            <Icon
                                                className={`h-6 w-6 ${config.color}`}
                                            />
                                        </div>

                                        {index !==
                                            activities.length - 1 && (
                                                <div className="mt-2 h-12 w-px bg-border" />
                                            )}
                                    </div>

                                    <div className="flex-1 rounded-xl border bg-background p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {activity.title}
                                                </h3>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {activity.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                {formatTime(
                                                    activity.created_at
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}