from django.contrib import admin

from .models import (
    Workspace,
    UploadedFile,
    AIJob,
    Activity,
)

# Register your models here.

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "created_at",
    )

    list_filter = (
        "created_at",
    )

    search_fields = (
        "name",
        "owner__email",
        "owner__username",
    )

    ordering = ("-created_at",)


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "filename",
        "uploaded_by",
        "workspace",
        "file_type",
        "size",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "file_type",
        "created_at",
    )

    search_fields = (
        "filename",
        "uploaded_by__email",
        "workspace__name",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
    )


@admin.register(AIJob)
class AIJobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "job_type",
        "workspace",
        "status",
        "progress",
        "started_at",
        "finished_at",
    )

    list_filter = (
        "job_type",
        "status",
    )

    search_fields = (
        "workspace__name",
    )

    ordering = ("-started_at",)

    readonly_fields = (
        "started_at",
        "finished_at",
    )


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "user",
        "workspace",
        "action",
        "created_at",
    )

    list_filter = (
        "action",
        "created_at",
    )

    search_fields = (
        "title",
        "message",
        "user__email",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
    )