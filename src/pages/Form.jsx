import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function Form() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileYear, setFileYear] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    // Replace with your backend endpoint URL
    const url = "http://localhost:8081/api/download/353"; // Example: /download/1

    axios
      .get(url, { responseType: "arraybuffer" })
      .then((response) => {
        setFileData(response.data);

        // Get the file name from the Content-Disposition header
        const contentDisposition =
          response.headers["content-disposition"].split(";");
        console.log(contentDisposition);
        const match = contentDisposition[1].substring(10);

        console.log(match);

        if (match) {
          setFileName(match);
          //   setFileYear(match[2]);
        }
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });
  }, []);

  const downloadFile = () => {
    if (fileData) {
      const blob = new Blob([fileData], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "downloaded-file.ext"; // Use the obtained file name or provide a default
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = () => {
    // Create a FormData object to send the file, filename, and year to the backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("year", year);

    // Send the FormData to the backend using Axios or another HTTP client
    axios
      .post("http://localhost:8081/api/save", formData)
      .then((response) => {
        // Handle the response from the backend
        console.log(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  };

  return (
    <div className="container">
      {fileData && (
        <div>
          <p>File Name: {fileName || "N/A"}</p>
          <button onClick={downloadFile}>Download File</button>
        </div>
      )}
      <div>
        <h2>File Upload Form</h2>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}
