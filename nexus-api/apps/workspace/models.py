from django.conf import settings
from django.db import models

# Create your models here.


class Workspace(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workspaces",
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.owner.email})"


class UploadedFile(models.Model):
    class Status(models.TextChoices):
        UPLOADING = "uploading", "Uploading"
        PROCESSING = "processing", "Processing"
        READY = "ready", "Ready"
        FAILED = "failed", "Failed"

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="files",
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="uploaded_files",
    )

    file = models.FileField(upload_to="workspace/files/%Y/%m/%d/")

    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    size = models.BigIntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UPLOADING,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.filename


class AIJob(models.Model):
    class JobType(models.TextChoices):
        DOCUMENT = "document", "Document Analysis"
        IMAGE = "image", "Image Analysis"
        SPREADSHEET = "spreadsheet", "Spreadsheet Analysis"
        REPORT = "report", "Report Generation"
        CHAT = "chat", "AI Chat"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="jobs",
    )

    uploaded_file = models.ForeignKey(
        UploadedFile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="jobs",
    )

    job_type = models.CharField(
        max_length=30,
        choices=JobType.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    progress = models.PositiveIntegerField(default=0)

    result = models.JSONField(
        blank=True,
        null=True,
    )

    started_at = models.DateTimeField(auto_now_add=True)

    finished_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.job_type} - {self.status}"


class Activity(models.Model):
    class Action(models.TextChoices):
        UPLOAD = "upload", "Upload"
        ANALYSIS = "analysis", "Analysis"
        REPORT = "report", "Report"
        DELETE = "delete", "Delete"
        DOWNLOAD = "download", "Download"
        SHARE = "share", "Share"
        LOGIN = "login", "Login"

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="activities",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    action = models.CharField(
        max_length=20,
        choices=Action.choices,
    )

    title = models.CharField(max_length=255)

    message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
