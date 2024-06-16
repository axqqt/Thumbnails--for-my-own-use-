"use client";
import { useState } from "react";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [thumbnails, setThumbnails] = useState<File[]>([]);
  const [results, setResults] = useState<{
    [key: string]: {
      thumbnail: string;
      recommendation: string;
    };
  }>({});

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files).slice(0, 4); // Limit to 4 files
    setThumbnails(selectedFiles);
  };

  const BASEURL = "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (thumbnails.length === 0) {
      alert("Please upload at least one thumbnail.");
      return;
    }

    const formData = new FormData();
    thumbnails.forEach((file, index) => {
      formData.append(`thumbnails`, file); // Use 'thumbnails' as the field name
    });

    try {
      const response = await axios.post(`${BASEURL}/thumbnails`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data);
    } catch (error) {
      console.error("Error uploading thumbnails:", error);
      alert("An error occurred while uploading thumbnails.");
    }
  };

  return (
    <div style={{ margin: "80px", fontSize: 24 }}>
      <h1>Evaluate YouTube Thumbnails</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Upload Thumbnails (up to 4):
            <input
              type="file"
              name="thumbnails"
              onChange={handleThumbnailUpload}
              multiple
              accept="image/png, image/jpeg"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {Object.keys(results).length > 0 && (
        <div>
          <h2>Evaluation Results</h2>
          {Object.keys(results).map((key) => (
            <div key={key}>
              <h3>Thumbnail {key}</h3>
              <p>{results[key].thumbnail}</p>
              <p>{results[key].recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
