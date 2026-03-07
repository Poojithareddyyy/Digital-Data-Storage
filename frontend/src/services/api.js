const API_BASE_URL = import.meta.env.VITE_API_URL || "https://digital-data-storage-6.onrender.com";
// Use API_BASE_URL for your axios/fetch calls

export const encodeFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/encode`, {
    method: "POST",
    body: formData
  });

  return await res.json();
};

export const decodeFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/decode`, {
    method: "POST",
    body: formData
  });

  return await res.json();
};

export const getFiles = async () => {
  const res = await fetch(`${API_URL}/files`);
  return await res.json();
};

export const downloadFile = (filename) => {
  window.open(`${API_URL}/download/${filename}`);
};