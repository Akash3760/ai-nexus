import os
import traceback

import fitz
import pandas as pd
from django.shortcuts import get_object_or_404
from django.urls import path
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Activity, AIJob, UploadedFile, Workspace
from .serializers import ActivitySerializer, UploadedFileSerializer

# Create your views here.


class WorkspaceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspace = Workspace.objects.filter(owner=request.user).first()

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
            "running_jobs": workspace.jobs.filter(status=AIJob.Status.RUNNING).count(),
            "total_activities": workspace.activities.count(),
        }

        return Response(data)


class RecentFilesView(generics.ListAPIView):
    serializer_class = UploadedFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UploadedFile.objects.filter(uploaded_by=self.request.user).order_by(
            "-created_at"
        )


class RecentActivityView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user).order_by("-created_at")


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

        # Determine a simplified file type
        extension = os.path.splitext(uploaded_file.name)[1].lower()

        if extension in [".xlsx", ".xls", ".csv"]:
            file_type = "spreadsheet"
        elif extension == ".pdf":
            file_type = "pdf"
        elif extension in [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".bmp",
            ".svg",
        ]:
            file_type = "image"
        else:
            file_type = "document"

        file = UploadedFile.objects.create(
            workspace=workspace,
            uploaded_by=request.user,
            file=uploaded_file,
            filename=uploaded_file.name,
            size=uploaded_file.size,
            file_type=file_type,
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
            # Excel
            if extension in [".xlsx", ".xls"]:
                df = pd.read_excel(path)
                df = df.fillna("")

                return Response(
                    {
                        "preview_type": "spreadsheet",
                        "filename": file.filename,
                        "file_type": file.file_type,
                        "sheet_name": "Sheet1",
                        "columns": list(df.columns),
                        "rows": df.values.tolist(),
                        "page_count": None,
                        "pages": [],
                        "image_url": None,
                        "message": None,
                    }
                )

            # CSV
            elif extension == ".csv":
                df = pd.read_csv(path)
                df = df.fillna("")

                return Response(
                    {
                        "preview_type": "spreadsheet",
                        "filename": file.filename,
                        "file_type": file.file_type,
                        "sheet_name": "Sheet1",
                        "columns": list(df.columns),
                        "rows": df.values.tolist(),
                        "page_count": None,
                        "pages": [],
                        "image_url": None,
                        "message": None,
                    }
                )

            # PDF
            elif extension == ".pdf":
                doc = fitz.open(path)

                pages = []

                for page in doc:
                    pages.append(page.get_text("text"))

                doc.close()

                return Response(
                    {
                        "preview_type": "pdf",
                        "filename": file.filename,
                        "file_type": file.file_type,
                        "sheet_name": None,
                        "columns": [],
                        "rows": [],
                        "page_count": len(pages),
                        "pages": pages,
                        "image_url": None,
                        "message": None,
                    }
                )

            # Images
            elif extension in [
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".bmp",
                ".webp",
                ".svg",
            ]:
                return Response(
                    {
                        "preview_type": "image",
                        "filename": file.filename,
                        "file_type": file.file_type,
                        "sheet_name": None,
                        "columns": [],
                        "rows": [],
                        "page_count": None,
                        "pages": [],
                        "image_url": request.build_absolute_uri(file.file.url),
                        "message": None,
                    }
                )

            # Unsupported
            else:
                return Response(
                    {
                        "preview_type": "unsupported",
                        "filename": file.filename,
                        "file_type": file.file_type,
                        "sheet_name": None,
                        "columns": [],
                        "rows": [],
                        "page_count": None,
                        "pages": [],
                        "image_url": None,
                        "message": "Preview is not available for this file type.",
                    }
                )

        except Exception as e:
            traceback.print_exc()

            return Response(
                {
                    "preview_type": "error",
                    "detail": str(e),
                    "filename": file.filename,
                    "file_type": file.file_type,
                    "sheet_name": None,
                    "columns": [],
                    "rows": [],
                    "page_count": None,
                    "pages": [],
                    "image_url": None,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class FileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        file = get_object_or_404(
            UploadedFile,
            pk=pk,
            uploaded_by=request.user,
        )

        workspace = file.workspace
        filename = file.filename

        # Delete the physical file (if it exists)
        if file.file:
            file.file.delete(save=False)

        # Delete the database record
        file.delete()

        # Log the activity
        Activity.objects.create(
            workspace=workspace,
            user=request.user,
            action=Activity.Action.DELETE,
            title="File Deleted",
            message=filename,
        )

        return Response(
            {"detail": "File deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
