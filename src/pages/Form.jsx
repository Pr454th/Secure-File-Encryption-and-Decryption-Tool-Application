import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function Form() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [key, setKey] = useState("");
  const [fileId,setFileId]=useState("");
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
  };

  const handleUpload = () => {
    // Create a FormData object to send the file, filename, and key to the backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("Key", key);

    // Send the FormData to the backend using Axios or another HTTP client
    axios
      .post("http://localhost:8081/api/save", formData)
      .then((response) => {
        // Handle the response from the backend
        console.log(response.data);
        setFileId(response.data);
        // Response
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
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Upload File</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Download File</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
  <div >
  <div class="row w-100 p-3 text-center"></div>
  <h2>File Upload Form</h2>
  </div>
  <br></br>
    <div class="row w-100 p-3">
    <text class="h5">Select File </text>
        <input class="bg-light" type="file" onChange={handleFileChange} />
        </div>
    <div class="row w-100 p-3">
    <text class="h5">Give a passKey </text>
    
      <input class="bg-light"
          type="text"
          placeholder="Key"
          
          value={key}
          onChange={(e) => setKey(e.target.value)}
          
        /></div>
<br></br>
        <div class="row w-100 p-3"><button class="btn btn-primary" onClick={handleUpload}>Upload File</button></div>
        <br></br>
        <div class="row w-100 p-3">
        {fileId&&(
          <div class="lead text-center">{fileId}</div>
        )}
        </div>
        
  </div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
    <div class="row w-100 p-3"><h2>File Download Form</h2></div>
    <div class="row w-100 p-3">
    <text class="h5">Give the file's id </text>
  <input class="bg-light"
          type="text"
          placeholder="fileId"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          
        /></div>
  <div class="row w-100 p-3">
  <text class="h5">Give the file's passKey </text>
  <input class="bg-light"
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          
        /></div>
        <div class="row w-100 p-3">
          <button class="btn btn-primary" onClick={downloadFile}>Download File</button></div>
      
  </div>
</div>
 
      </div>
  );
}
