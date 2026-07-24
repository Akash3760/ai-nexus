from django.urls import path

from .views import (
    WorkspaceStatsView,
    RecentFilesView,
    RecentActivityView,
    FileUploadView,
    FilePreviewView,
    FileDeleteView,
)

urlpatterns = [
    path(
        "stats/",
        WorkspaceStatsView.as_view(),
        name="workspace-stats",
    ),
    path(
        "files/",
        RecentFilesView.as_view(),
        name="recent-files",
    ),
    path(
        "files/<int:pk>/preview/",
        FilePreviewView.as_view(),
        name="file-preview",
    ),
    path(
        "files/<int:pk>/",
        FileDeleteView.as_view(),
        name="file-delete",
    ),
    path(
        "activity/",
        RecentActivityView.as_view(),
        name="recent-activity",
    ),
    path(
        "upload/",
        FileUploadView.as_view(),
        name="file-upload",
    ),
]