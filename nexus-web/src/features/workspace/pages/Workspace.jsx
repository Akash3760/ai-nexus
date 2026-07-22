import WorkspaceHeader from "../components/WorkspaceHeader";
import WorkspaceStats from "../components/WorkspaceStats";
import WorkspaceFilters from "../components/WorkspaceFilters";

export default function Workspace() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <WorkspaceHeader />

            {/* Dashboard Statistics */}
            <WorkspaceStats />

            {/* Search & Filters */}
            <WorkspaceFilters />

            {/*
                Next Components

                <UploadZone />
                <QuickActions />
                <RecentFiles />
                <RecentActivity />
            */}
        </div>
    );
}