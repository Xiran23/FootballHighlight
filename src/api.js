const API_BASE_URL = "http://127.0.0.1:8000";

export const checkBackend = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok ? "Backend is connected and running!" : `Backend responded with ${res.status}`;
  } catch (err) {
    return "Backend NOT reachable. Check if it's running.";
  }
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && !data.error) {
      return { success: true, url: data.final_clip_url };
    } else {
      return { success: false, error: data.error || "Upload failed." };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};
