import os

from apps.workspace.models import UploadedFile


class DocumentService:
    SUPPORTED_EXTENSIONS = {
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".bmp",
    }

    MIME_TYPES = {
        ".pdf": "application/pdf",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".bmp": "image/bmp",
    }

    def __init__(self, uploaded_file: UploadedFile):
        self.uploaded_file = uploaded_file

        if not uploaded_file.file:
            raise ValueError("Uploaded file does not exist.")

        self.path = uploaded_file.file.path

        if not os.path.exists(self.path):
            raise ValueError("Uploaded file was not found on disk.")

        if not os.path.isfile(self.path):
            raise ValueError("Uploaded file path is not a valid file.")

        self.extension = os.path.splitext(uploaded_file.filename)[1].lower()

        if self.extension not in self.SUPPORTED_EXTENSIONS:
            raise ValueError(
                "Unsupported document format: " f"{self.extension or 'unknown'}"
            )

    def get_mime_type(self):
        mime_type = self.MIME_TYPES.get(self.extension)

        if not mime_type:
            raise ValueError(f"Unsupported MIME type: " f"{self.extension}")

        return mime_type

    def get_file_bytes(self):
        try:
            with open(self.path, "rb") as file:
                data = file.read()
        except OSError as exc:
            raise ValueError("Unable to read uploaded file.") from exc

        if not data:
            raise ValueError("Uploaded file is empty.")

        return data

    def build_context(self):
        return {
            "filename": self.uploaded_file.filename,
            "file_type": self.extension,
            "mime_type": self.get_mime_type(),
            "size": self.uploaded_file.size,
        }
