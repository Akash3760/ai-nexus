import os
import time

from google import genai
from google.genai import types


class GeminiService:
    MAX_RETRIES = 3

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured.")

        self.client = genai.Client(api_key=api_key)

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-3.6-flash",
        )

    # INTERNAL GEMINI REQUEST
    def _generate_content(self, contents):
        last_error = None

        for attempt in range(self.MAX_RETRIES + 1):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=contents,
                )

                if not response.text:
                    raise ValueError("Gemini returned an empty response.")

                return response.text

            except Exception as exc:
                last_error = exc

                error_text = str(exc).lower()

                is_transient = (
                    "503" in error_text
                    or "unavailable" in error_text
                    or "service unavailable" in error_text
                    or "429" in error_text
                    or "resource exhausted" in error_text
                )

                if not is_transient:
                    raise

                if attempt >= self.MAX_RETRIES:
                    break

                wait_seconds = 2**attempt

                time.sleep(wait_seconds)

        raise ValueError(
            "Gemini is temporarily unavailable. " "Please try again in a moment."
        ) from last_error

    # SPREADSHEET SUMMARY
    def generate_summary(self, context):
        prompt = f"""
            You are an enterprise data analysis assistant
            for AI Nexus.

            Analyze the supplied spreadsheet information.

            Provide:

            1. A short overall summary
            2. Important observations
            3. Notable data quality issues
            4. Useful business insights

            Rules:

            - Be concise and accurate.
            - Do not invent facts.
            - Only use information present in the supplied data.
            - If something cannot be determined from the data,
            explicitly say so.

            Spreadsheet information:

            {context}
            """

        return self._generate_content(prompt)

    # PDF / IMAGE SUMMARY
    def generate_file_summary(
        self,
        file_bytes,
        mime_type,
    ):
        if not file_bytes:
            raise ValueError("Uploaded file is empty.")

        if not mime_type:
            raise ValueError("File MIME type is required.")

        # PDF
        if mime_type == "application/pdf":

            prompt = """
                You are an enterprise document analysis
                assistant for AI Nexus.

                Analyze the provided PDF document.

                Provide:

                1. A short overall summary
                2. Important sections or topics
                3. Key facts and findings
                4. Important tables, charts, or figures
                5. Notable observations
                6. Document or data quality issues
                7. Useful business insights

                Rules:

                - Do not invent facts.
                - Only use information present in the PDF.
                - If something cannot be determined,
                explicitly say so.
                - Keep the response structured and concise.
                """

        # IMAGE
        elif mime_type.startswith("image/"):

            prompt = """
                You are an enterprise visual analysis
                assistant for AI Nexus.

                Analyze the provided image.

                Provide:

                1. A short description of the image
                2. Important visible information
                3. Readable text
                4. Tables, charts, or diagrams if present
                5. Important observations
                6. Useful business insights

                Rules:

                - Only describe information actually visible
                in the image.
                - Do not invent facts.
                - If text is unclear or unreadable,
                explicitly say so.
                - Keep the response structured and concise.
                """

        else:
            raise ValueError(f"Unsupported MIME type: {mime_type}")

        # MULTIMODAL CONTENT
        file_part = types.Part.from_bytes(
            data=file_bytes,
            mime_type=mime_type,
        )

        contents = [
            file_part,
            prompt,
        ]

        return self._generate_content(contents)
