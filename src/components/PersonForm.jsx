import React, { useState } from "react";

const PersonForm = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("imagen", imagen);

    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setStatus(data.detail);
    } catch {
      setStatus("Error al registrar.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Registrar Persona</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
          </form>

          {status && (
            <div className="alert alert-info mt-4" role="alert">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonForm;
