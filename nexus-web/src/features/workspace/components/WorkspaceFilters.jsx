import {
    Search,
    FolderOpen,
    CalendarDays,
    ArrowUpDown,
    Upload,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function WorkspaceFilters() {
    return (
        <section
            className="
                rounded-[32px]
                border
                border-border
                bg-card
                p-6
                shadow-sm
            "
        >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}
                <div className="relative w-full lg:max-w-lg">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search files, reports, conversations..."
                        className="h-12 rounded-xl pl-11"
                    />
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-4">

                    {/* File Type */}
                    <Select defaultValue="all">
                        <SelectTrigger className="h-12 min-w-[180px] rounded-xl">
                            <div className="flex items-center gap-2">
                                <FolderOpen className="h-4 w-4 text-cyan-500" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Files
                            </SelectItem>

                            <SelectItem value="spreadsheet">
                                Spreadsheet
                            </SelectItem>

                            <SelectItem value="pdf">
                                PDF
                            </SelectItem>

                            <SelectItem value="document">
                                Word Document
                            </SelectItem>

                            <SelectItem value="image">
                                Image
                            </SelectItem>

                            <SelectItem value="presentation">
                                Presentation
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Time */}
                    <Select defaultValue="30days">
                        <SelectTrigger className="h-12 min-w-[180px] rounded-xl">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-cyan-500" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="today">
                                Today
                            </SelectItem>

                            <SelectItem value="7days">
                                Last 7 Days
                            </SelectItem>

                            <SelectItem value="30days">
                                Last 30 Days
                            </SelectItem>

                            <SelectItem value="year">
                                This Year
                            </SelectItem>

                            <SelectItem value="all">
                                All Time
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select defaultValue="recent">
                        <SelectTrigger className="h-12 min-w-[190px] rounded-xl">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4 text-cyan-500" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="recent">
                                Recently Updated
                            </SelectItem>

                            <SelectItem value="created">
                                Recently Created
                            </SelectItem>

                            <SelectItem value="name">
                                Name (A-Z)
                            </SelectItem>

                            <SelectItem value="size">
                                File Size
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Upload */}
                    <Button className="h-12 rounded-xl px-6">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>

                </div>
            </div>
        </section>
    );
}