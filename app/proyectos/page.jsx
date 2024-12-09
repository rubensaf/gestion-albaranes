'use client';

import { useState, useEffect } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);  // Lista de clientes
  const [newProject, setNewProject] = useState({
    name: '',
    projectCode: '',
    email: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
    code: '',
    clientId: '',  
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  //Funcion para ayudar con la autentificacion
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Usuario no autenticado');

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    return response.json();
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjectsAndClients = async () => {
      try {
        setLoading(true);

        // Obtener proyectos
        const projectsData = await fetchWithAuth('https://bildy-rpmaya.koyeb.app/api/project');
        setProjects(projectsData);

        // Obtener clientes
        const clientsData = await fetchWithAuth('https://bildy-rpmaya.koyeb.app/api/client');
        setClients(clientsData);
      } catch (error) {
        setError('Error al cargar los proyectos y clientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndClients();
  }, []);

  // Handle form submission for adding or editing a project
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!newProject.name || !newProject.projectCode || !newProject.email || !newProject.clientId) {
      setError('Por favor, llena todos los campos obligatorios.');
      return;
    }

    const method = editProjectId ? 'PUT' : 'POST';
    const url = editProjectId
      ? `https://bildy-rpmaya.koyeb.app/api/project/${editProjectId}`
      : 'https://bildy-rpmaya.koyeb.app/api/project';

    try {
      setLoading(true);
      const savedProject = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (editProjectId) {
        setProjects((prev) =>
          prev.map((project) => (project._id === editProjectId ? savedProject : project))
        );
      } else {
        setProjects((prev) => [...prev, savedProject]);
      }

      resetForm();
    } catch (error) {
      setError('Error al guardar el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await fetchWithAuth(`https://bildy-rpmaya.koyeb.app/api/project/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (error) {
      setError('Error al eliminar el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a project
  const handleEdit = (project) => {
    setEditProjectId(project._id);
    setNewProject({
      name: project.name,
      projectCode: project.projectCode,
      email: project.email,
      address: { ...project.address },
      code: project.code,
      clientId: project.clientId,  // Asignar el cliente al proyecto
      notes: project.notes || '',
    });
    setShowForm(true);
  };

  // Handle adding a new project
  const handleAdd = () => {
    setShowForm(true);
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setNewProject({
      name: '',
      projectCode: '',
      email: '',
      address: {
        street: '',
        number: '',
        postal: '',
        city: '',
        province: '',
      },
      code: '',
      clientId: '',
      notes: '',
    });
    setEditProjectId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-500 mb-6">Gestión de Proyectos</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Botón para agregar proyecto */}
      <div className="flex justify-start mb-6">
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Agregar Proyecto
        </button>
      </div>

      {/* Formulario (Solo se muestra si se hace clic en "Agregar Proyecto" o "Editar") */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del Proyecto"
              className="input font-bold"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Código del Proyecto"
              className="input font-bold"
              value={newProject.projectCode}
              onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="input font-bold"
              value={newProject.email}
              onChange={(e) => setNewProject({ ...newProject, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Calle"
              className="input font-bold"
              value={newProject.address.street}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  address: { ...newProject.address, street: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="Número"
              className="input font-bold"
              value={newProject.address.number}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  address: { ...newProject.address, number: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="Código Postal"
              className="input font-bold"
              value={newProject.address.postal}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  address: { ...newProject.address, postal: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="input font-bold"
              value={newProject.address.city}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  address: { ...newProject.address, city: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="Provincia"
              className="input font-bold"
              value={newProject.address.province}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  address: { ...newProject.address, province: e.target.value },
                })
              }
            />
          </div>

          {/* Selección de Cliente */}
          <div className="mb-4">
            <label htmlFor="clientId" className="block text-white font-bold mb-2">
              Cliente
            </label>
            <select
              id="clientId"
              className="input font-bold"
              value={newProject.clientId}
              onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
            >
              <option value="">Seleccionar Cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nota */}
          <textarea
            placeholder="Notas"
            className="input font-bold"
            value={newProject.notes}
            onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
          >
            {editProjectId ? 'Actualizar Proyecto' : 'Agregar Proyecto'}
          </button>
        </form>
      )}

      {/* Tabla de proyectos */}
      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-green-500">Nombre</th>
                <th className="px-4 py-2 text-left text-green-500">Código</th>
                <th className="px-4 py-2 text-left text-green-500">Correo</th>
                <th className="px-4 py-2 text-left text-green-500">Cliente</th>
                <th className="px-4 py-2 text-left text-green-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="bg-gray-700 hover:bg-gray-600">
                  <td className="px-4 py-2 text-white">{project.name}</td>
                  <td className="px-4 py-2 text-white">{project.projectCode}</td>
                  <td className="px-4 py-2 text-white">{project.email}</td>
                  <td className="px-4 py-2 text-white">
                    {project.clientId ? (
                      clients.find((client) => client._id === project.clientId)?.name
                    ) : (
                      'No asignado'
                    )}
                  </td>
                  <td className="px-4 py-2 text-white">
                    <button
                      onClick={() => handleEdit(project)}
                      className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
