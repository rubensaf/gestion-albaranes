"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AlbaranForm = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [format, setFormat] = useState("material");
  const [formVisible, setFormVisible] = useState(false);
  const [editAlbaran, setEditAlbaran] = useState(null); // Para la edición

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const clientsRes = await axios.get(
          "https://bildy-rpmaya.koyeb.app/api/client",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClients(clientsRes.data);

        const materialsRes = await axios.get(
          "https://bildy-rpmaya.koyeb.app/api/material",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMaterials(materialsRes.data);

        const deliveryNotesRes = await axios.get(
          "https://bildy-rpmaya.koyeb.app/api/deliverynote",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeliveryNotes(deliveryNotesRes.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedClient) {
        const token = localStorage.getItem("jwt");
        try {
          const res = await axios.get(
            `https://bildy-rpmaya.koyeb.app/api/project?clientId=${selectedClient}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProjects(res.data);
        } catch (error) {
          console.error("Error al cargar los proyectos:", error);
        }
      } else {
        setProjects([]);
      }
    };

    fetchProjects();
  }, [selectedClient]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const newAlbaran = {
        clientId: selectedClient,
        projectId: selectedProject,
        format: format,
        material: selectedMaterial,
        hours: hours,
        description: description,
        workdate: date,
      };

      if (editAlbaran) {
        const res = await axios.put(
          `https://bildy-rpmaya.koyeb.app/api/deliverynote/${editAlbaran._id}`,
          newAlbaran,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeliveryNotes((prev) =>
          prev.map((note) => (note._id === editAlbaran._id ? res.data : note))
        );
      } else {
        const res = await axios.post(
          "https://bildy-rpmaya.koyeb.app/api/deliverynote",
          newAlbaran,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeliveryNotes((prev) => [...prev, res.data]);
      }

      setFormVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error al guardar el albarán:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwt");
    try {
      await axios.delete(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error al eliminar el albarán:", error);
    }
  };

  const handleEdit = (albaran) => {
    setEditAlbaran(albaran);
    setSelectedClient(albaran.clientId);
    setSelectedProject(albaran.projectId);
    setSelectedMaterial(albaran.material);
    setHours(albaran.hours);
    setDescription(albaran.description);
    setDate(albaran.workdate);
    setFormat(albaran.format);
    setFormVisible(true);
  };

  const handleDownloadPDF = async (id) => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await axios.get(
        `https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `albaran-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };

  const resetForm = () => {
    setSelectedClient("");
    setSelectedProject("");
    setSelectedMaterial("");
    setHours("");
    setDescription("");
    setDate("");
    setFormat("material");
    setEditAlbaran(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Gestión de Albaranes</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => {
            resetForm();
            setFormVisible(true);
          }}
          className="py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Crear Albarán
        </button>
      </div>

      {formVisible && (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-lg font-semibold text-green-600">Cliente</label>
            <select
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Seleccione un cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-green-600">Proyecto</label>
            <select
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={!selectedClient}
            >
              <option value="">Seleccione un proyecto</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-green-600">Formato</label>
            <select
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="material">Material</option>
              <option value="hours">Horas</option>
            </select>
          </div>

          {format === "material" && (
            <div>
              <label className="block text-lg font-semibold text-green-600">Material</label>
              <select
                className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                <option value="">Seleccione material</option>
                {materials.map((material) => (
                  <option key={material._id} value={material._id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {format === "hours" && (
            <div>
              <label className="block text-lg font-semibold text-green-600">Horas</label>
              <input
                type="number"
                className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold text-green-600">Descripción</label>
            <textarea
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-green-600">Fecha de Trabajo</label>
            <input
              type="date"
              className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
            >
              {editAlbaran ? "Guardar Cambios" : "Crear Albarán"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setFormVisible(false)}
              className="text-red-500 hover:text-red-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center text-green-600">Lista de Albaranes</h3>
        <ul>
          {deliveryNotes.length === 0 ? (
            <p className="text-gray-500 text-center">No hay albaranes creados.</p>
          ) : (
            deliveryNotes.map((note) => (
              <li key={note._id} className="flex justify-between bg-gray-700 rounded-md p-4 my-2">
                <div>
                  <p className="font-semibold text-white">{note.description}</p>
                  <p className="text-gray-400">{note.workdate}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(note._id)}
                    className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  >
                    Descargar PDF
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AlbaranForm;
