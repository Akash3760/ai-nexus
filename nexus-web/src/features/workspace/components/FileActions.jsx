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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
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

                <DropdownMenuItem
                    onClick={() =>
                        navigate(`/dashboard/workspace/file/${file.id}`)
                    }
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onDownload?.(file)}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() =>
                        navigate(`/dashboard/workspace/file/${file.id}/summary`)
                    }
                >
                    <Sparkles className="mr-2 h-4 w-4 text-cyan-500" />
                    AI Summary
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        navigate(`/dashboard/workspace/file/${file.id}/clean`)
                    }
                >
                    <BrushCleaning className="mr-2 h-4 w-4 text-emerald-500" />
                    Data Cleaning
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        navigate(`/dashboard/workspace/file/${file.id}/duplicates`)
                    }
                >
                    <CopyCheck className="mr-2 h-4 w-4 text-amber-500" />
                    Duplicate Detection
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        navigate(`/dashboard/workspace/file/${file.id}/insights`)
                    }
                >
                    <BarChart3 className="mr-2 h-4 w-4 text-violet-500" />
                    AI Insights
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        navigate(`/dashboard/workspace/file/${file.id}/chat`)
                    }
                >
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                    Chat with Spreadsheet
                </DropdownMenuItem>

                <DropdownMenuSeparator />

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