import os

import pandas as pd

from apps.workspace.models import UploadedFile


class SpreadsheetService:
    SUPPORTED_EXTENSIONS = {
        ".xlsx",
        ".xls",
        ".csv",
    }

    SAMPLE_ROWS = 20

    def __init__(self, uploaded_file: UploadedFile):
        self.uploaded_file = uploaded_file

        if not uploaded_file.file:
            raise ValueError("Uploaded file does not exist.")

        self.path = uploaded_file.file.path

        self.extension = os.path.splitext(uploaded_file.filename)[1].lower()

        if self.extension not in self.SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported spreadsheet format: " f"{self.extension or 'unknown'}"
            )

    def load_dataframe(self):
        if self.extension == ".csv":
            return pd.read_csv(self.path)

        if self.extension == ".xlsx":
            return pd.read_excel(
                self.path,
                engine="openpyxl",
            )

        if self.extension == ".xls":
            return pd.read_excel(self.path)

        raise ValueError(f"Unsupported spreadsheet format: " f"{self.extension}")

    def build_context(self):
        df = self.load_dataframe()

        # Replace NaN / NaT values.
        df = df.fillna("")

        column_types = {}

        for column in df.columns:
            column_types[str(column)] = str(df[column].dtype)

        missing_values = {}

        for column in df.columns:
            count = int(df[column].replace("", pd.NA).isna().sum())

            if count > 0:
                missing_values[str(column)] = count

        sample = df.head(self.SAMPLE_ROWS).to_dict(orient="records")

        safe_sample = []

        for row in sample:
            safe_row = {}

            for key, value in row.items():
                if pd.isna(value):
                    safe_row[str(key)] = ""
                else:
                    safe_row[str(key)] = str(value)

            safe_sample.append(safe_row)

        context = {
            "filename": self.uploaded_file.filename,
            "file_type": self.extension,
            "row_count": int(len(df)),
            "column_count": int(len(df.columns)),
            "columns": [str(column) for column in df.columns],
            "data_types": column_types,
            "missing_values": missing_values,
            "sample_rows": safe_sample,
        }

        return context

    def build_ai_context(self):
        context = self.build_context()

        lines = [
            f"Filename: {context['filename']}",
            f"File type: {context['file_type']}",
            f"Rows: {context['row_count']}",
            f"Columns: {context['column_count']}",
            "",
            "Columns:",
            ", ".join(context["columns"]),
            "",
            "Data types:",
        ]

        for column, dtype in context["data_types"].items():
            lines.append(f"- {column}: {dtype}")

        lines.extend(
            [
                "",
                "Missing values:",
            ]
        )

        if context["missing_values"]:
            for column, count in context["missing_values"].items():
                lines.append(f"- {column}: {count}")
        else:
            lines.append("- No missing values detected.")

        lines.extend(
            [
                "",
                f"Sample rows " f"(maximum {self.SAMPLE_ROWS}):",
            ]
        )

        for index, row in enumerate(
            context["sample_rows"],
            start=1,
        ):
            lines.append(f"{index}. {row}")

        return "\n".join(lines)
