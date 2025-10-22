import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const Identify = () => {
  const webcamRef = useRef(null);
  const [webcamKey, setWebcamKey] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureAndIdentify = async () => {
    setResult(null);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setResult({ status: "fail", detail: "No se pudo capturar imagen" });
      return;
    }

setCapturedImage(imageSrc);

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
    const data = await res.json().catch(() => ({
      status: "error",
      detail: "Respuesta inválida del servidor",
    }));
    setResult(data);
  } catch (err) {
    console.error("Error:", err);
    setResult({ status: "error", detail: "Error al identificar" });
  } finally {
    setLoading(false);
    setWebcamKey(prev => prev + 1); // 🔁 reinicia la webcam
  }
};


  return (
    <div className="card p-6">
      <h2 className="mb-2">Identificar Persona</h2>
      
      <div className="d-flex flex-column align-items-center mb-4">
        <Webcam
          key={webcamKey}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded shadow-sm mb-3"
          style={{ width: "100%", maxWidth: "500px" }}
        />
        <button
          className="btn btn-primary"
          onClick={captureAndIdentify}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Capturar e Identificar"}
        </button>
      </div>

      {/* Imágenes lado a lado */}
      {/* <div className="d-flex flex-wrap gap-4 mb-4">
        {capturedImage && (
          <div>
            <h5>📸 Imagen capturada:</h5>
            <img
              src={capturedImage}
              alt="Captura de webcam"
              className="img-fluid rounded shadow"
              style={{ width: "300px", height: "auto", objectFit: "cover" }}
            />
          </div>
        )}

        {result?.status === "ok" && result.match_image && (
          <div>
            <h5>🧠 Imagen reconocida:</h5>
            <img
              src={`http://localhost:8000/${result.match_image}`}
              alt="Imagen reconocida"
              className="img-fluid rounded shadow"
              style={{ width: "300px", height: "auto", objectFit: "cover" }}
            />
          </div>
        )}
      </div> */}

      {/* Resultado textual */}
      {result && (
        <div className="mt-3">
          {result.status === "ok" ? (
            <div className="alert alert-success">
              Persona reconocida: <strong>{result.person}</strong><br />
              Distancia: {result.distance?.toFixed(4)}
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
