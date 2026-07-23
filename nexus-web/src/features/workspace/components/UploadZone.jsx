import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    UploadCloud,
    FileSpreadsheet,
    FileText,
    Image,
    FolderOpen,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/workspaceService";

export default function UploadZone() {
    const inputRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleUpload = async (file) => {
        if (!file) return;

        setUploading(true);
        setMessage(null);
        setError(null);

        try {
            await uploadFile(file);

            setMessage(`${file.name} uploaded successfully.`);
        } catch (err) {
            console.error(err);
            setError("Failed to upload file.");
        } finally {
            setUploading(false);
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            handleUpload(file);
        }

        e.target.value = "";
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (file) {
            handleUpload(file);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-border/50
                bg-card
                p-8
                shadow-sm
            "
        >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-cyan-500/10 p-4">
                        <UploadCloud className="h-8 w-8 text-cyan-500" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">
                            Upload Files
                        </h2>

                        <p className="mt-1 text-muted-foreground">
                            Drag & drop files or browse your computer to begin AI analysis.
                        </p>
                    </div>
                </div>

                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`
                        mt-8
                        rounded-2xl
                        border-2
                        border-dashed
                        px-8
                        py-14
                        text-center
                        transition-all
                        duration-300
                        ${dragging
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-cyan-500/30 bg-cyan-500/5"
                        }
                    `}
                >
                    <UploadCloud className="mx-auto h-14 w-14 text-cyan-500" />

                    <h3 className="mt-5 text-xl font-semibold">
                        Drag & Drop Files Here
                    </h3>

                    <p className="mt-2 text-muted-foreground">
                        Supports Excel, PDF, Word, Images, CSV and more.
                    </p>

                    <input
                        ref={inputRef}
                        type="file"
                        hidden
                        onChange={onFileChange}
                    />

                    <Button
                        disabled={uploading}
                        onClick={() => inputRef.current?.click()}
                        className="mt-8 rounded-xl px-8"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Browse Files
                            </>
                        )}
                    </Button>

                    {message && (
                        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-4">
                    <FeatureCard
                        icon={FileSpreadsheet}
                        color="text-green-500"
                        title="Excel"
                        subtitle="XLSX, XLS, CSV"
                    />

                    <FeatureCard
                        icon={FileText}
                        color="text-red-500"
                        title="Documents"
                        subtitle="PDF, DOCX, TXT"
                    />

                    <FeatureCard
                        icon={Image}
                        color="text-violet-500"
                        title="Images"
                        subtitle="PNG, JPG, JPEG"
                    />

                    <FeatureCard
                        icon={UploadCloud}
                        color="text-cyan-500"
                        title="AI Analysis"
                        subtitle="Automatic processing"
                    />
                </div>
            </div>
        </motion.section>
    );
}

function FeatureCard({
    icon: Icon,
    color,
    title,
    subtitle,
}) {
    return (
        <div className="rounded-xl border bg-background p-5">
            <Icon className={`mb-3 h-8 w-8 ${color}`} />

            <h4 className="font-semibold">
                {title}
            </h4>

            <p className="mt-1 text-sm text-muted-foreground">
                {subtitle}
            </p>
        </div>
    );
}