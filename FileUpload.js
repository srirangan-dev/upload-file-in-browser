import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileUrl(""); // reset previous file
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file); // Must match multer key

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setFileUrl(res.data.fileUrl);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Upload failed. Check backend is running and CORS is enabled."
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <br /><br />
        <button type="submit">Upload</button>
      </form>

      {fileUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded File:</h3>

          {file.type.startsWith("image") && (
            <img src={fileUrl} alt="uploaded" style={{ maxWidth: "300px" }} />
          )}

          {file.type === "application/pdf" && (
            <iframe src={fileUrl} width="600" height="400" title="PDF Preview" />
          )}

          {!file.type.startsWith("image") && file.type !== "application/pdf" && (
            <a href={fileUrl} target="_blank" rel="noreferrer">
              Download File
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
