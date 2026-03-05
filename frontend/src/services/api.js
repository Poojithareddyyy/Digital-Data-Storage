const API_URL = "http://127.0.0.1:8000";

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