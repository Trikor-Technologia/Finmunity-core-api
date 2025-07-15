import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected file:", selectedFile);
    if (!selectedFile) {
      setMessage("No file selected.");
      return;
    }
    setFile(selectedFile);
    setMessage(`File selected: ${selectedFile.name}`);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      console.log("Uploading image...");
      setMessage("Uploading...");

      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      console.log("Upload successful:", res.data);
      setUrl(res.data.imageUrl);
      setMessage("Upload successful!");
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Upload failed. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Image Upload to Cloudinary</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: "10px" }}>Upload</button>
      </form>
      <p>{message}</p>
      {url && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={url} alt="Uploaded" width="300" />
          <p>URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
        </div>
      )}
    </div>
  );
}

export default App;
