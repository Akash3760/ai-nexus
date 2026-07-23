import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileSpreadsheet,
    Loader2,
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        to="/dashboard/workspace"
                        className="mb-4 inline-flex items-center gap-2 text-sm text-cyan-500 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Workspace
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-green-500/10 p-3">
                            <FileSpreadsheet className="h-8 w-8 text-green-500" />
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
            </div>

            {/* File Information */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">
                        Sheet
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                        {preview.sheet_name}
                    </h3>
                </div>

                <div className="rounded-xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">
                        Columns
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                        {preview.columns.length}
                    </h3>
                </div>

                <div className="rounded-xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">
                        Rows
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                        {preview.rows.length}
                    </h3>
                </div>
            </div>

            {/* Excel Preview */}
            <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        Spreadsheet Preview
                    </h2>
                </div>

                <div className="p-4">
                    {preview.rows?.length > 0 ? (
                        <ExcelGrid
                            columns={preview.columns}
                            rows={preview.rows}
                        />
                    ) : (
                        <div className="py-20 text-center text-muted-foreground">
                            No data found.
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}