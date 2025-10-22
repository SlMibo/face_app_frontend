import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const Identify = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureAndIdentify = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);
    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/identify", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setResult({ status: "error", detail: "Error al identificar" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-3">Identificar Persona</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded shadow-sm mb-3"
        style={{ width: "100%", maxWidth: "400px" }}
      />
      <button className="btn btn-primary" onClick={captureAndIdentify} disabled={loading}>
        {loading ? "Procesando..." : "Capturar e Identificar"}
      </button>

      {result && (
        <div className="mt-4">
          {result.status === "ok" ? (
            <div className="alert alert-success">
              Persona reconocida: <strong>{result.person}</strong>
            </div>
          ) : (
            <div className="alert alert-warning">
              {result.detail || "No se pudo identificar"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Identify;
