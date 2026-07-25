from rest_framework import serializers

from .models import Activity, AIJob, UploadedFile, Workspace


class WorkspaceSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(
        source="owner.username",
        read_only=True,
    )

    class Meta:
        model = Workspace
        fields = (
            "id",
            "owner",
            "owner_name",
            "name",
            "description",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "owner",
            "created_at",
            "updated_at",
        )


class UploadedFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(
        source="uploaded_by.username",
        read_only=True,
    )

    class Meta:
        model = UploadedFile
        fields = (
            "id",
            "workspace",
            "uploaded_by",
            "uploaded_by_name",
            "filename",
            "file",
            "file_type",
            "size",
            "status",
            "created_at",
        )
        read_only_fields = (
            "uploaded_by",
            "uploaded_by_name",
            "status",
            "created_at",
        )


class AIJobSerializer(serializers.ModelSerializer):
    uploaded_file_name = serializers.CharField(
        source="uploaded_file.filename",
        read_only=True,
    )

    class Meta:
        model = AIJob
        fields = (
            "id",
            "workspace",
            "uploaded_file",
            "uploaded_file_name",
            "job_type",
            "status",
            "progress",
            "result",
            "started_at",
            "finished_at",
        )


class ActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = Activity
        fields = (
            "id",
            "workspace",
            "user",
            "user_name",
            "action",
            "title",
            "message",
            "created_at",
        )
        read_only_fields = (
            "user",
            "user_name",
            "created_at",
        )
