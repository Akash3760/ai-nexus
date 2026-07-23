import { useState } from "react";

import WorkspaceHeader from "../components/WorkspaceHeader";
import WorkspaceStats from "../components/WorkspaceStats";
import WorkspaceFilters from "../components/WorkspaceFilters";
import UploadZone from "../components/UploadZone";
import QuickActions from "../components/QuickActions";
import RecentFiles from "../components/RecentFiles";
import RecentActivity from "../components/RecentActivity";

export default function Workspace() {
    const [filters, setFilters] = useState({
        search: "",
        fileType: "all",
        period: "30days",
        sort: "recent",
    });

    return (
        <div className="space-y-8">
            <WorkspaceHeader />

            <WorkspaceStats />

            <WorkspaceFilters
                filters={filters}
                onChange={setFilters}
            />

            <UploadZone />

            <QuickActions />

            <RecentFiles filters={filters} />

            <RecentActivity filters={filters} />
        </div>
    );
}