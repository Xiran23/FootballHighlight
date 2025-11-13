import React, { useState } from "react";
import { checkBackend, uploadFile } from "./api";
import "./App.css";

function MainApp() {
  const [status, setStatus] = useState("Check backend status first.");
  const [statusColor, setStatusColor] = useState("white");
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Loading state to disable buttons & show spinner
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCheckBackend = async () => {
    setLoading(true);
    setStatus("Checking backend...");
    const result = await checkBackend();
    setStatus(result);
    setStatusColor(result.includes("running") ? "lightgreen" : "red");
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus("Uploading and processing file...");
    setStatusColor("lightblue");

    const result = await uploadFile(file);
    if (result.success) {
      setStatus("Upload and processing successful!");
      setStatusColor("lightgreen");
      setDownloadUrl(result.url);
    } else {
      setStatus(`Error: ${result.error}`);
      setStatusColor("red");
      setDownloadUrl(null);
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    if (!downloadUrl) {
      alert("Please upload and process a video first.");
      return;
    }

    try {
      setDownloading(true);
      setStatus("Downloading video...");
      setStatusColor("lightblue");

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted_clip.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatus("Download complete!");
      setStatusColor("lightgreen");
    } catch (err) {
      setStatus(`Download failed: ${err.message}`);
      setStatusColor("red");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Football Highlights Generator</h1>
      <p className="status" style={{ color: statusColor }}>
        {status}
      </p>

      {(loading || downloading) && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      <div className="button-container">
        <button
          className="btn btn-yellow"
          onClick={handleCheckBackend}
          disabled={loading || downloading}
        >
          Check Backend
        </button>

        <label className={`btn btn-blue ${loading ? "disabled" : ""}`}>
          Upload Video
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            disabled={loading || downloading}
            style={{ display: "none" }}
          />
        </label>

        <button
          className="btn btn-green"
          onClick={handleDownload}
          disabled={!downloadUrl || downloading || loading}
        >
          {downloading ? "Downloading..." : "Download Processed Video"}
        </button>
      </div>
    </div>
  );
}

export default MainApp;
