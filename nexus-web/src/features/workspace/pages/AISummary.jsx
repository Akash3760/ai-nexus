import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
    ArrowLeft,
    FileSpreadsheet,
    FileText,
    Image as ImageIcon,
    File,
    Loader2,
    Sparkles,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import { generateFileSummary } from "@/services/aiService";

/* =========================================================
   File Type Configuration
========================================================= */

const fileTypeConfig = {
    spreadsheet: {
        icon: FileSpreadsheet,
        iconClass: "text-green-500",
        iconBg: "bg-green-500/10",
        description:
            "AI-generated analysis based on your spreadsheet data.",
    },

    pdf: {
        icon: FileText,
        iconClass: "text-red-500",
        iconBg: "bg-red-500/10",
        description:
            "AI-generated analysis based on the contents of your PDF.",
    },

    image: {
        icon: ImageIcon,
        iconClass: "text-violet-500",
        iconBg: "bg-violet-500/10",
        description:
            "AI-generated analysis based on the visual contents of your image.",
    },

    default: {
        icon: File,
        iconClass: "text-slate-500",
        iconBg: "bg-slate-500/10",
        description:
            "AI-generated analysis of your uploaded file.",
    },
};

/* =========================================================
   Helpers
========================================================= */

function getFileTypeConfig(category) {
    return (
        fileTypeConfig[category] ??
        fileTypeConfig.default
    );
}

/* =========================================================
   Component
========================================================= */

export default function AISummary() {
    const { id } = useParams();

    const [summary, setSummary] = useState("");
    const [filename, setFilename] = useState("");
    const [fileType, setFileType] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =====================================================
       Load Summary
    ===================================================== */

    const loadSummary = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await generateFileSummary(id);

            setSummary(data.summary || "");
            setFilename(data.filename || "");
            setFileType(data.category || "");
        } catch (err) {
            console.error(
                "AI summary error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Unable to generate AI summary."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       Initial Load
    ===================================================== */

    useEffect(() => {
        loadSummary();
    }, [id]);

    /* =====================================================
       File Configuration
    ===================================================== */

    const config =
        getFileTypeConfig(fileType);

    const FileIcon = config.icon;

    /* =====================================================
       Loading State
    ===================================================== */

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-5 text-center">

                    <div className="rounded-2xl bg-cyan-500/10 p-4">
                        <Sparkles
                            className="
                                h-9
                                w-9
                                animate-pulse
                                text-cyan-500
                            "
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Generating AI Summary
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            AI Nexus is analyzing your file...
                        </p>
                    </div>

                    <Loader2
                        className="
                            h-5
                            w-5
                            animate-spin
                            text-cyan-500
                        "
                    />
                </div>
            </div>
        );
    }

    /* =====================================================
       Error State
    ===================================================== */

    if (error) {
        return (
            <div className="mx-auto max-w-3xl">
                <div
                    className="
                        rounded-3xl
                        border
                        border-red-500/20
                        bg-card
                        p-8
                        text-center
                        shadow-sm
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500/10
                        "
                    >
                        <AlertCircle
                            className="
                                h-7
                                w-7
                                text-red-500
                            "
                        />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                        Unable to Generate Summary
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {error}
                    </p>

                    <div className="mt-6 flex justify-center gap-3">

                        <button
                            type="button"
                            onClick={loadSummary}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-border
                                px-4
                                py-2
                                text-sm
                                font-medium
                                transition-colors
                                hover:bg-muted
                            "
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>

                        <Link
                            to={`/dashboard/workspace/files/${id}`}
                            className="
                                inline-flex
                                items-center
                                rounded-lg
                                bg-cyan-600
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition-colors
                                hover:bg-cyan-700
                            "
                        >
                            Back to File
                        </Link>

                    </div>
                </div>
            </div>
        );
    }

    /* =====================================================
       Main UI
    ===================================================== */

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.3,
            }}
            className="space-y-8"
        >
            {/* =================================================
                Header
            ================================================= */}

            <div>
                <Link
                    to={`/dashboard/workspace/files/${id}`}
                    className="
                        mb-5
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-cyan-500
                        transition-colors
                        hover:text-cyan-400
                        hover:underline
                    "
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to File
                </Link>

                <div className="flex items-center gap-4">

                    {/* File Icon */}

                    <div
                        className={`
                            rounded-2xl
                            p-4
                            ${config.iconBg}
                        `}
                    >
                        <FileIcon
                            className={`
                                h-8
                                w-8
                                ${config.iconClass}
                            `}
                        />
                    </div>

                    {/* Title */}

                    <div className="min-w-0">

                        <div className="flex items-center gap-2">
                            <Sparkles
                                className="
                                    h-5
                                    w-5
                                    text-cyan-500
                                "
                            />

                            <span
                                className="
                                    text-sm
                                    font-medium
                                    text-cyan-500
                                "
                            >
                                AI Analysis
                            </span>
                        </div>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            AI Summary
                        </h1>

                        {filename && (
                            <div
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                <FileIcon
                                    className={`
                                        h-4
                                        w-4
                                        ${config.iconClass}
                                    `}
                                />

                                <span className="max-w-xl truncate">
                                    {filename}
                                </span>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* =================================================
                Summary Card
            ================================================= */}

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                "
            >
                {/* Card Header */}

                <div
                    className="
                        border-b
                        border-border
                        px-6
                        py-5
                    "
                >
                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <div className="flex items-center gap-2">
                                <Sparkles
                                    className="
                                        h-5
                                        w-5
                                        text-cyan-500
                                    "
                                />

                                <h2 className="text-xl font-semibold">
                                    AI Analysis
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {config.description}
                            </p>
                        </div>

                        {/* File Category */}

                        {fileType && (
                            <div
                                className="
                                    hidden
                                    rounded-full
                                    border
                                    border-border
                                    bg-muted/50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    capitalize
                                    text-muted-foreground
                                    sm:block
                                "
                            >
                                {fileType}
                            </div>
                        )}

                    </div>
                </div>

                {/* Summary Content */}

                <div className="p-6">

                    {summary ? (
                        <div
                            className="
                                rounded-2xl
                                border
                                border-border
                                bg-muted/20
                                p-6
                            "
                        >
                            <div
                                className="
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-7
                                    text-foreground
                                "
                            >
                                {summary}
                            </div>
                        </div>
                    ) : (
                        <div
                            className="
                                rounded-2xl
                                border
                                border-dashed
                                border-border
                                py-20
                                text-center
                                text-muted-foreground
                            "
                        >
                            <Sparkles
                                className="
                                    mx-auto
                                    h-8
                                    w-8
                                    text-muted-foreground/50
                                "
                            />

                            <p className="mt-3 text-sm">
                                No summary was generated.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </motion.div>
    );
}