from django.urls import path

from .views import FileSummaryView


urlpatterns = [
    path(
        "files/<int:file_id>/summary/",
        FileSummaryView.as_view(),
        name="file-summary",
    ),
]
