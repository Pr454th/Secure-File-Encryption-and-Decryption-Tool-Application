import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function Form() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [key, setKey] = useState("");
  const [fileId, setFileId] = useState("");
  const [fileName, setFileName] = useState("");

  const validateKey = () => {
    if (key.length === 0) {
      alert("Please enter the key");
      return false;
    }
    if (key.length < 8 || key.length > 8) {
      alert("Key length should be of length 8");
      return false;
    }
    return true;
  };

  const downloadFile = () => {
    const url = `http://localhost:8081/api/download/${fileId}/${key}`; // Example: /download/1
    if (!validateKey()) {
      return;
    }
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
        setFileName(match);
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        console.log(match);
        a.download = match || "downloaded-file.ext"; // Use the obtained file name or provide a default
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setFileData(null);
        setFileId("");
        setKey("");
        setFileName("");
        setFile(null);
        const fileInput = document.getElementById("formFile");
        fileInput.value = "";
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    // Create a FormData object to send the file, filename, and key to the backend
    if (!validateKey()) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);
    console.log(formData);
    // Send the FormData to the backend using Axios or another HTTP client
    axios
      .post("http://localhost:8081/api/save", formData)
      .then((response) => {
        // Handle the response from the backend
        console.log(response.data);
        setFileId(response.data);
        setKey("");
        setFile(null);
        const fileInput = document.getElementById("formFile");
        fileInput.value = "";
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  };

  return (
    <div className="w-100">
      <ul class="navtab nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            Upload File
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile"
            type="button"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >
            Download File
          </button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          style={{ height: "600px" }}
          class="tab-pane fade show active"
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <div>
            <div class="row w-100 p-3 text-center"></div>
            <h2>File Upload</h2>
          </div>
          <br></br>
          <div class="mb-3">
            <label for="formFile" class="form-label">
              File Input
            </label>
            <input
              class="form-control"
              type="file"
              id="formFile"
              onChange={handleFileChange}
            />
          </div>
          <div class="mb-2">
            <label for="exampleFormControlInput1" class="form-label">
              Give a passKey
            </label>
            <input
              type="email"
              class="form-control"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Key"
            />
          </div>
          <br></br>
          <div class="row w-100 mx-auto">
            <button class="btn btn-primary" onClick={handleUpload}>
              Upload File
            </button>
          </div>
          <br></br>
          <div class="row w-100 p-3">
            {fileId && <div class="lead text-center">{fileId}</div>}
          </div>
        </div>
        <div
          style={{ height: "600px" }}
          class="tab-pane fade"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <div class="row w-100 p-3 mt-3">
            <h2>File Download</h2>
          </div>
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">
              File's ID
            </label>
            <input
              type="email"
              class="form-control"
              placeholder="File ID"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
            />
          </div>
          <div class="mb-2">
            <label for="exampleFormControlInput1" class="form-label">
              Give the file's passKey
            </label>
            <input
              type="email"
              class="form-control"
              placeholder="Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div class="row w-100 mt-4 mx-auto">
            <button class="btn btn-primary" onClick={downloadFile}>
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
