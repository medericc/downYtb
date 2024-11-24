"use client";
import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setMessage("");
    setDownloadLink("");

    try {
      const response = await fetch("http://127.0.0.1:5000/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = window.URL.createObjectURL(blob);
        setDownloadLink(link);
        setMessage("Téléchargement réussi ! Cliquez sur le bouton ci-dessous.");
      } else {
        const errorData = await response.json();
        setMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error: unknown) {
      // Vérification si 'error' est bien une instance d'Error
      if (error instanceof Error) {
        setMessage(`Erreur : ${error.message}`);
      } else {
        setMessage("Une erreur inconnue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          YouTube Downloader
        </h1>
        <p className="text-gray-600 mb-4">
          Collez l&apos;URL d&apos;une vidéo YouTube et téléchargez-la en un clic.
        </p>
        <input
          type="text"
          className="w-full p-3 border border-gray-700 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Entrez l'URL YouTube"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleDownload}
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Téléchargement..." : "Télécharger"}
        </button>
        {message && (
          <p className="mt-4 text-sm text-gray-700">{message}</p>
        )}
        {downloadLink && (
          <a
            href={downloadLink}
            download="video.mp4"
            className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all"
          >
            Télécharger la vidéo
          </a>
        )}
      </div>
    </div>
  );
}
