from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.workspace.models import UploadedFile

from .services.gemini_service import GeminiService
from .services.spreadsheet_service import SpreadsheetService
from .services.document_service import DocumentService


# Create your views here.
class FileSummaryView(APIView):
    """
    Generate an AI summary for an uploaded file.

    Supported file types:

    Spreadsheet:
        .xlsx
        .xls
        .csv

    Documents:
        .pdf

    Images:
        .jpg
        .jpeg
        .png
        .webp
        .bmp
    """

    permission_classes = [IsAuthenticated]

    SPREADSHEET_EXTENSIONS = (
        ".xlsx",
        ".xls",
        ".csv",
    )

    DOCUMENT_EXTENSIONS = (
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".bmp",
    )

    def post(self, request, file_id):
        uploaded_file = UploadedFile.objects.filter(
            id=file_id,
            uploaded_by=request.user,
        ).first()

        if not uploaded_file:
            return Response(
                {"detail": "File not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        filename = uploaded_file.filename.lower()

        try:
            gemini_service = GeminiService()

            # ==================================================
            # SPREADSHEET
            # ==================================================

            if filename.endswith(self.SPREADSHEET_EXTENSIONS):
                spreadsheet_service = SpreadsheetService(uploaded_file)

                context = spreadsheet_service.build_ai_context()

                summary = gemini_service.generate_summary(context)

                file_category = "spreadsheet"

            # ==================================================
            # PDF / IMAGE
            # ==================================================

            elif filename.endswith(self.DOCUMENT_EXTENSIONS):
                document_service = DocumentService(uploaded_file)

                # Read the actual uploaded file
                file_bytes = document_service.get_file_bytes()

                # Determine MIME type
                mime_type = document_service.get_mime_type()

                # Send file bytes to Gemini
                summary = gemini_service.generate_file_summary(
                    file_bytes=file_bytes,
                    mime_type=mime_type,
                )

                if filename.endswith(".pdf"):
                    file_category = "pdf"
                else:
                    file_category = "image"

            # ==================================================
            # UNSUPPORTED
            # ==================================================

            else:
                return Response(
                    {
                        "detail": (
                            "AI summary is not supported " "for this file type."
                        ),
                        "filename": (uploaded_file.filename),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ==================================================
            # SUCCESS
            # ==================================================

            return Response(
                {
                    "file_id": uploaded_file.id,
                    "filename": uploaded_file.filename,
                    "file_type": uploaded_file.file_type,
                    "category": file_category,
                    "summary": summary,
                },
                status=status.HTTP_200_OK,
            )

        # ======================================================
        # EXPECTED / VALIDATION ERROR
        # ======================================================

        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ======================================================
        # UNEXPECTED ERROR
        # ======================================================

        except Exception as exc:
            import traceback

            traceback.print_exc()

            return Response(
                {
                    "detail": ("Unable to generate AI summary."),
                    "error": str(exc),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
