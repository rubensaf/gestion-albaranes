"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const Resumen = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener datos de clientes, proyectos y albaranes
  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Obtener token de localStorage

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch de Clientes
        const clientsRes = await axios.get(
          "https://bildy-rpmaya.koyeb.app/api/client",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClients(clientsRes.data);

        // Fetch de Proyectos
        const projectsRes = await axios.get(
          "https://bildy-rpmaya.koyeb.app/api/project",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(projectsRes.data);

        // Fetch de Albaranes
        const deliveryNotesRes = await axios.get(
          "https://bildy-rpmaya.koyeb.app/api/deliverynote",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeliveryNotes(deliveryNotesRes.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Resumen de Gestión</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-400">Cargando datos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Clientes */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Clientes</h2>
            {clients.length > 0 ? (
              <ul className="text-gray-400">
                {clients.slice(0, 5).map((client) => (
                  <li key={client._id} className="mb-2">
                    {client.name || "Cliente sin nombre"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay clientes registrados.</p>
            )}
            <Link
              href="/clientes"
              className="mt-4 block py-2 px-4 bg-blue-500 text-center font-bold rounded hover:bg-blue-600"
            >
              Ver Todos
            </Link>
          </div>

          {/* Proyectos */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Proyectos</h2>
            {projects.length > 0 ? (
              <ul className="text-gray-400">
                {projects.slice(0, 5).map((project) => (
                  <li key={project._id} className="mb-2">
                    {project.name || "Proyecto sin nombre"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay proyectos creados.</p>
            )}
            <Link
              href="/proyectos"
              className="mt-4 block py-2 px-4 bg-blue-500 text-center font-bold rounded hover:bg-blue-600"
            >
              Ver Todos
            </Link>
          </div>

          {/* Albaranes */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Albaranes</h2>
            {deliveryNotes.length > 0 ? (
              <ul className="text-gray-400">
                {deliveryNotes.slice(0, 5).map((note) => (
                  <li key={note._id} className="mb-2">
                    {note.description || "Sin descripción"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay albaranes creados.</p>
            )}
            <Link
              href="/albaranes"
              className="mt-4 block py-2 px-4 bg-blue-500 text-center font-bold rounded hover:bg-blue-600"
            >
              Ver Todos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resumen;
