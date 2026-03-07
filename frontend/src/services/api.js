const API_BASE_URL = import.meta.env.VITE_API_URL || "https://digital-data-storage-6.onrender.com";

export const encodeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/encode`, {
        method: "POST",
        body: formData
    });
    return await res.json();
};

export const decodeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/decode`, {
        method: "POST",
        body: formData
    });
    return await res.json();
};

export const getFiles = async () => {
    const res = await fetch(`${API_BASE_URL}/files`);
    return await res.json();
};

// This is the function the Vercel build is currently missing
export const downloadFile = async (filename) => {
    const res = await fetch(`${API_BASE_URL}/download/${filename}`);
    if (!res.ok) throw new Error("Download failed");
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};