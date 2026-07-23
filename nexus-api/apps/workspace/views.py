import os
import pandas as pd

from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Workspace,
    UploadedFile,
    Activity,
    AIJob,
)

from .serializers import (
    UploadedFileSerializer,
    ActivitySerializer,
)

# Create your views here.

class WorkspaceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspace = Workspace.objects.filter(
            owner=request.user
        ).first()

        if not workspace:
            return Response(
                {
                    "total_files": 0,
                    "completed_jobs": 0,
                    "running_jobs": 0,
                    "total_activities": 0,
                }
            )

        data = {
            "total_files": workspace.files.count(),
            "completed_jobs": workspace.jobs.filter(
                status=AIJob.Status.COMPLETED
            ).count(),
            "running_jobs": workspace.jobs.filter(
                status=AIJob.Status.RUNNING
            ).count(),
            "total_activities": workspace.activities.count(),
        }

        return Response(data)


class RecentFilesView(generics.ListAPIView):
    serializer_class = UploadedFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UploadedFile.objects.filter(
            uploaded_by=self.request.user
        ).order_by("-created_at")


class RecentActivityView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def post(self, request):
        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response(
                {"detail": "No file uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        workspace, _ = Workspace.objects.get_or_create(
            owner=request.user,
            defaults={
                "name": f"{request.user.username}'s Workspace",
            },
        )

        file = UploadedFile.objects.create(
            workspace=workspace,
            uploaded_by=request.user,
            file=uploaded_file,
            filename=uploaded_file.name,
            size=uploaded_file.size,
            file_type=uploaded_file.content_type,
            status=UploadedFile.Status.READY,
        )

        Activity.objects.create(
            workspace=workspace,
            user=request.user,
            action=Activity.Action.UPLOAD,
            title="File Uploaded",
            message=uploaded_file.name,
        )

        serializer = UploadedFileSerializer(file)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class FilePreviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        file = get_object_or_404(
            UploadedFile,
            pk=pk,
            uploaded_by=request.user,
        )

        path = file.file.path
        extension = os.path.splitext(path)[1].lower()

        try:

            if extension in [".xlsx", ".xls"]:

                df = pd.read_excel(path)

            elif extension == ".csv":

                df = pd.read_csv(path)

            else:
                return Response(
                    {
                        "filename": file.filename,
                        "file_type": file.file_type,
                        "message": "Preview not available for this file type.",
                    },
                    status=400,
                )

            df = df.fillna("")

            return Response(
                {
                    "filename": file.filename,
                    "file_type": "spreadsheet",
                    "sheet_name": "Sheet1",
                    "columns": list(df.columns),
                    "rows": df.values.tolist(),
                }
            )

        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=500,
            )