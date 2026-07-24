import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FileSpreadsheet,
    FileText,
    Image,
    File,
    Clock3,
    ArrowUpRight,
} from "lucide-react";

import {
    getRecentFiles,
    deleteFile,
    downloadFile,
} from "@/services/workspaceService";

import FileActions from "./FileActions";
import DeleteFileDialog from "./DeleteFileDialog";

const iconMap = {
    spreadsheet: {
        icon: FileSpreadsheet,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    pdf: {
        icon: FileText,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
    image: {
        icon: Image,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
    default: {
        icon: File,
        color: "text-slate-500",
        bg: "bg-slate-500/10",
    },
};

function formatFileSize(bytes) {
    if (!bytes) return "--";

    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatTime(date) {
    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function RecentFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadFiles() {
            try {
                const data = await getRecentFiles();

                if (!ignore) {
                    setFiles(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadFiles();

        return () => {
            ignore = true;
        };
    }, []);

    const handleDownload = async (file) => {
        try {
            await downloadFile(file.id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (file) => {
        setSelectedFile(file);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedFile) return;

        try {
            setDeleting(true);

            await deleteFile(selectedFile.id);

            setFiles((prev) =>
                prev.filter((f) => f.id !== selectedFile.id)
            );

            setDeleteOpen(false);
            setSelectedFile(null);
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Recent Files
                    </h2>

                    <p className="mt-1 text-muted-foreground">
                        Continue working with your latest uploads.
                    </p>
                </div>

                <Link
                    to="/dashboard/workspace/files"
                    className="text-sm font-medium text-cyan-500 hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
                        Loading files...
                    </div>
                ) : files.length === 0 ? (
                    <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
                        No files uploaded yet.
                    </div>
                ) : (
                    files.map((file, index) => {
                        const config =
                            iconMap[file.file_type] ??
                            iconMap.default;

                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={file.id}
                                initial={{
                                    opacity: 0,
                                    y: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.08,
                                }}
                                whileHover={{
                                    y: -2,
                                }}
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        border
                                        bg-card
                                        p-5
                                        transition-all
                                        hover:border-cyan-500/40
                                        hover:shadow-md
                                    "
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`
                                            rounded-xl
                                            p-3
                                            ${config.bg}
                                        `}
                                        >
                                            <Icon
                                                className={`h-6 w-6 ${config.color}`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {file.filename}
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {file.file_type} •{" "}
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">

                                        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                                            <Clock3 className="h-4 w-4" />
                                            {formatTime(file.created_at)}
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(`/dashboard/workspace/files/${file.id}`)
                                            }
                                            className="
                                                rounded-lg
                                                p-2
                                                transition-colors
                                                hover:bg-muted
                                            "
                                        >
                                            <ArrowUpRight className="h-5 w-5" />
                                        </button>

                                        <FileActions
                                            file={file}
                                            onDownload={handleDownload}
                                            onDelete={handleDeleteClick}
                                        />

                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <DeleteFileDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                file={selectedFile}
                loading={deleting}
                onConfirm={handleDelete}
            />

        </section>
    );
}