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
    Table2,
    AlertCircle,
} from "lucide-react";

import { getFilePreview } from "@/services/workspaceService";
import ExcelGrid from "@/features/workspace/components/ExcelGrid";

export default function FilePreview() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function loadPreview() {
            try {
                setLoading(true);
                setError("");

                const data = await getFilePreview(id);

                if (!ignore) {
                    setPreview(data);
                }
            } catch (err) {
                console.error(err);

                if (!ignore) {
                    setError("Unable to load file preview.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadPreview();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
                    <p className="text-muted-foreground">
                        Loading file...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-red-300 bg-red-50 p-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

                    <h2 className="mt-4 text-xl font-bold">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        {error}
                    </p>

                    <Link
                        to="/dashboard/workspace"
                        className="mt-6 inline-flex items-center rounded-lg bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700"
                    >
                        Back to Workspace
                    </Link>
                </div>
            </div>
        );
    }

    if (!preview) return null;

    const type = preview.preview_type;

    const icon =
        type === "spreadsheet" ? (
            <FileSpreadsheet className="h-8 w-8 text-green-500" />
        ) : type === "pdf" ? (
            <FileText className="h-8 w-8 text-red-500" />
        ) : type === "image" ? (
            <ImageIcon className="h-8 w-8 text-violet-500" />
        ) : (
            <File className="h-8 w-8 text-slate-500" />
        );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div>
                <Link
                    to="/dashboard/workspace"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-cyan-500 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-muted p-3">
                        {icon}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">
                            {preview.filename}
                        </h1>

                        <p className="text-muted-foreground">
                            {preview.file_type}
                        </p>
                    </div>
                </div>
            </div>

            {type === "spreadsheet" && (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border bg-card p-5">
                            <p className="text-sm text-muted-foreground">
                                Sheet
                            </p>

                            <h3 className="mt-2 text-xl font-semibold">
                                {preview.sheet_name}
                            </h3>
                        </div>

                        <div className="rounded-2xl border bg-card p-5">
                            <p className="text-sm text-muted-foreground">
                                Columns
                            </p>

                            <h3 className="mt-2 text-xl font-semibold">
                                {preview.columns.length}
                            </h3>
                        </div>

                        <div className="rounded-2xl border bg-card p-5">
                            <p className="text-sm text-muted-foreground">
                                Rows
                            </p>

                            <h3 className="mt-2 text-xl font-semibold">
                                {preview.rows.length}
                            </h3>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border bg-card">
                        <div className="border-b px-6 py-5">
                            <h2 className="flex items-center gap-2 text-xl font-semibold">
                                <Table2 className="h-5 w-5 text-cyan-500" />
                                Spreadsheet Preview
                            </h2>
                        </div>

                        <div className="p-6">
                            <ExcelGrid
                                columns={preview.columns}
                                rows={preview.rows}
                            />
                        </div>
                    </div>
                </>
            )}

            {type === "pdf" && (
                <div className="rounded-3xl border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        PDF Preview ({preview.page_count} pages)
                    </h2>

                    <div className="space-y-6">
                        {preview.pages.map((page, index) => (
                            <div
                                key={index}
                                className="rounded-xl border bg-muted/30 p-5"
                            >
                                <h3 className="mb-3 font-semibold">
                                    Page {index + 1}
                                </h3>

                                <pre className="whitespace-pre-wrap font-sans text-sm">
                                    {page || "(No text found on this page)"}
                                </pre>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {type === "image" && (
                <div className="rounded-3xl border bg-card p-6">
                    <img
                        src={preview.image_url}
                        alt={preview.filename}
                        className="mx-auto max-h-[700px] rounded-xl"
                    />
                </div>
            )}

            {type === "unsupported" && (
                <div className="rounded-2xl border bg-card p-10 text-center">
                    <File className="mx-auto h-12 w-12 text-muted-foreground" />

                    <h2 className="mt-4 text-xl font-semibold">
                        Preview not available
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        {preview.message}
                    </p>
                </div>
            )}
        </motion.div>
    );
}