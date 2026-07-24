import api from "@/api/axios";

/* =========================
   Dashboard
========================= */

export async function getWorkspaceStats() {
    const { data } = await api.get("workspace/stats/");
    return data;
}

/* =========================
   Files
========================= */

export async function getRecentFiles(params = {}) {
    const { data } = await api.get("workspace/files/", {
        params,
    });

    return data;
}

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post(
        "workspace/upload/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
}

export async function getFilePreview(
    id,
    page = 1,
    pageSize = 10
) {
    const { data } = await api.get(
        `workspace/files/${id}/preview/`,
        {
            params: {
                page,
                page_size: pageSize,
            },
        }
    );

    return data;
}

export async function deleteFile(id) {
    await api.delete(`workspace/files/${id}/`);
}

export async function downloadFile(id) {
    const response = await api.get(
        `workspace/files/${id}/download/`,
        {
            responseType: "blob",
        }
    );

    const disposition =
        response.headers["content-disposition"];

    let filename = "download";

    if (disposition) {
        const match = disposition.match(
            /filename="?(.+?)"?$/
        );

        if (match) {
            filename = match[1];
        }
    }

    const url = window.URL.createObjectURL(
        new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
}

/* =========================
   Activity
========================= */

export async function getRecentActivity(params = {}) {
    const { data } = await api.get(
        "workspace/activity/",
        {
            params,
        }
    );

    return data;
}

/* =========================
   AI Jobs
========================= */

export async function getAIJobs(params = {}) {
    const { data } = await api.get(
        "workspace/jobs/",
        {
            params,
        }
    );

    return data;
}

export async function getAIJob(id) {
    const { data } = await api.get(
        `workspace/jobs/${id}/`
    );

    return data;
}