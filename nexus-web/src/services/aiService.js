import api from "@/api/axios";

/* =========================
   Spreadsheet AI
========================= */

export async function generateSpreadsheetSummary(fileId) {
    const { data } = await api.post(
        `ai/files/${fileId}/summary/`
    );

    return data;
}