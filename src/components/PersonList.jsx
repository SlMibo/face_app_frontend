import React, { useEffect, useState } from "react";
import { FaUser, FaTrash, FaEdit, FaEye } from "react-icons/fa";

const PersonList = () => {
  const [personas, setPersonas] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editImagen, setEditImagen] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/list")
      .then((res) => res.json())
      .then((data) => setPersonas(data))
      .catch((err) => console.error("Error:", err));
  }, []);


  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta persona?")) return;
    try {
      const res = await fetch(`http://localhost:8000/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setPersonas(personas.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const handleEdit = (id) => {
    const persona = personas.find((p) => p.id === id);
    setSelectedPerson(persona);
    setEditNombre(persona.nombre);
    setShowModal(true);
  };


  const handleView = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/persona/${id}`);
    const data = await res.json();
    setViewData(data);
    setViewModal(true);
  } catch (err) {
    console.error("Error al ver detalles:", err);
  }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", editNombre);
    if (editImagen) formData.append("imagen", editImagen);

    try {
      const res = await fetch(`http://localhost:8000/update/${selectedPerson.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      const updated = personas.map((p) =>
        p.id === selectedPerson.id ? { ...p, nombre: editNombre } : p
      );
      setPersonas(updated);
      setShowModal(false);
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">Personas Registradas</h2>
      {personas.length === 0 ? (
        <p className="text-muted">No hay personas registradas aún.</p>
      ) : (
        <div className="row">
          {personas.map((p) => (
            <div className="col-md-3 mb-3" key={p.id}>
              <div className="card h-100 shadow-sm animate__animated animate__fadeIn">
                <img
                  src={`http://localhost:8000/${p.imagen}`}
                  alt={p.nombre}
                  className="card-img-top"
                  style={{ height: "75%", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <FaUser className="me-2" />
                    {p.nombre}
                  </h5>
                  <div className="card-footer d-flex justify-content-center gap-2">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                      <FaTrash />
                    </button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(p.id)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleView(p.id)}>
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {showModal && (
        <div className="modal show d-block animate__animated animate__fadeInDown" tabIndex="-1" role="dialog" style={{ backgroundColor: "#00000088" }}>
          <div className="modal-dialog" role="document">
            <form onSubmit={handleSubmitEdit} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Persona</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nueva Imagen (opcional)</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setEditImagen(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Guardar cambios</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Modal de vista */}
        {viewModal && viewData && (
        <div className="modal show d-block animate__animated animate__fadeInDown" tabIndex="-1" role="dialog" style={{ backgroundColor: "#00000088" }}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Detalles de {viewData.nombre}</h5>
                <button type="button" className="btn-close" onClick={() => setViewModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                <img
                    src={`http://localhost:8000/${viewData.imagen}`}
                    alt={viewData.nombre}
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                />
                <h5>{viewData.nombre}</h5>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setViewModal(false)}>Cerrar</button>
                </div>
            </div>
            </div>
        </div>
        )}

    </div>
  );
};

export default PersonList;
