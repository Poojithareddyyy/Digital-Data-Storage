const API_BASE_URL = import.meta.env.VITE_API_URL || "https://digital-data-storage-6.onrender.com";

export const encodeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/encode`, { // Use backticks ``
        method: "POST",
        body: formData
    });
    return await res.json();
};

export const decodeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/decode`, { // Use backticks ``
        method: "POST",
        body: formData
    });
    return await res.json();
};

export const getFiles = async () => {
    const res = await fetch(`${API_BASE_URL}/files`); // Use backticks ``
    return await res.json();
};