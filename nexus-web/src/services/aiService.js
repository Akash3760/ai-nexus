import api from "@/api/axios";

/* =========================
   File AI Summary
========================= */

export async function generateFileSummary(fileId) {
    const { data } = await api.post(
        `ai/files/${fileId}/summary/`
    );

    return data;
}