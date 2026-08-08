import { useNavigate } from "react-router-dom";

import {
    MoreVertical,
    Eye,
    Download,
    Trash2,
    Sparkles,
    BrushCleaning,
    CopyCheck,
    BarChart3,
    MessageSquare,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export default function FileActions({
    file,
    onDownload,
    onDelete,
}) {
    const navigate = useNavigate();

    if (!file) {
        return null;
    }

    const fileId = file.id;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="File actions"
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-56"
            >
                <DropdownMenuLabel>
                    File Actions
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Preview */}
                <DropdownMenuItem
                    onClick={() =>
                        navigate(
                            `/dashboard/workspace/files/${fileId}`
                        )
                    }
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                </DropdownMenuItem>

                {/* Download */}
                <DropdownMenuItem
                    onClick={() => onDownload?.(file)}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* AI Summary */}
                <DropdownMenuItem
                    onClick={() =>
                        navigate(
                            `/dashboard/workspace/files/${fileId}/summary`
                        )
                    }
                >
                    <Sparkles className="mr-2 h-4 w-4 text-cyan-500" />
                    AI Summary
                </DropdownMenuItem>

                {/* Data Cleaning */}
                <DropdownMenuItem
                    onClick={() =>
                        navigate(
                            `/dashboard/workspace/files/${fileId}/clean`
                        )
                    }
                >
                    <BrushCleaning className="mr-2 h-4 w-4 text-emerald-500" />
                    Data Cleaning
                </DropdownMenuItem>

                {/* Duplicate Detection */}
                <DropdownMenuItem
                    onClick={() =>
                        navigate(
                            `/dashboard/workspace/files/${fileId}/duplicates`
                        )
                    }
                >
                    <CopyCheck className="mr-2 h-4 w-4 text-amber-500" />
                    Duplicate Detection
                </DropdownMenuItem>

                {/* AI Insights */}
                <DropdownMenuItem
                    onClick={() =>
                        navigate(
                            `/dashboard/workspace/files/${fileId}/insights`
                        )
                    }
                >
                    <BarChart3 className="mr-2 h-4 w-4 text-violet-500" />
                    AI Insights
                </DropdownMenuItem>

                {/* Chat */}
                <DropdownMenuItem
                    onClick={() =>
                        navigate(
                            `/dashboard/workspace/files/${fileId}/chat`
                        )
                    }
                >
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                    Chat with Spreadsheet
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Delete */}
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => onDelete?.(file)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete File
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}