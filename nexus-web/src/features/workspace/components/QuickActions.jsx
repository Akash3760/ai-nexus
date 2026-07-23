import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FileSpreadsheet,
    FileText,
    Image,
    BrainCircuit,
    Sparkles,
    Workflow,
    ArrowRight,
} from "lucide-react";

const actions = [
    {
        title: "Analyze Spreadsheet",
        description: "Upload Excel or CSV files for AI-powered insights.",
        icon: FileSpreadsheet,
        color: "text-green-500",
        bg: "bg-green-500/10",
        path: "/dashboard/workspace/spreadsheet",
    },
    {
        title: "Analyze PDF",
        description: "Extract, summarize and understand PDF documents.",
        icon: FileText,
        color: "text-red-500",
        bg: "bg-red-500/10",
        path: "/dashboard/workspace/pdf",
    },
    {
        title: "Image Analysis",
        description: "Detect objects, OCR and generate visual insights.",
        icon: Image,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
        path: "/dashboard/workspace/image",
    },
    {
        title: "AI Report",
        description: "Generate professional reports from uploaded files.",
        icon: BrainCircuit,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        path: "/dashboard/workspace/report",
    },
    {
        title: "Smart Workflow",
        description: "Automate repetitive AI processing tasks.",
        icon: Workflow,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        path: "/dashboard/workspace/workflow",
    },
    {
        title: "AI Assistant",
        description: "Chat with your documents and workspace.",
        icon: Sparkles,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        path: "/dashboard/workspace/chat",
    },
];

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-muted-foreground">
                        Launch AI tools with a single click.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <motion.button
                            key={action.title}
                            type="button"
                            onClick={() => navigate(action.path)}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.35,
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -6,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                bg-card
                                p-6
                                text-left
                                shadow-sm
                                transition-all
                                duration-300
                                hover:border-cyan-500/40
                                hover:shadow-xl
                                focus:outline-none
                                focus:ring-2
                                focus:ring-cyan-500/40
                            "
                        >
                            <div
                                className={`
                                    inline-flex
                                    rounded-xl
                                    p-3
                                    ${action.bg}
                                `}
                            >
                                <Icon
                                    className={`h-7 w-7 ${action.color}`}
                                />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold">
                                {action.title}
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {action.description}
                            </p>

                            <div
                                className="
                                    mt-6
                                    flex
                                    items-center
                                    font-medium
                                    text-cyan-500
                                "
                            >
                                Launch

                                <ArrowRight
                                    className="
                                        ml-2
                                        h-4
                                        w-4
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                />
                            </div>

                            <div
                                className="
                                    absolute
                                    -right-10
                                    -top-10
                                    h-32
                                    w-32
                                    rounded-full
                                    bg-cyan-500/5
                                    blur-3xl
                                "
                            />
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
}