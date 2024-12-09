"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ClientesPage = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    cif: "",
    street: "",
    number: "",
    postal: "",
    city: "",
    province: "",
  });
  const [message, setMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error.response?.data || error.message);
      }
    };

    fetchClients();
  }, []);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    const clientData = {
      name: formData.name.trim(),
      cif: formData.cif.trim(),
      address: {
        street: formData.street.trim(),
        number: parseInt(formData.number, 10),
        postal: parseInt(formData.postal, 10),
        city: formData.city.trim(),
        province: formData.province.trim(),
      },
    };

    try {
      const response = await axios.post(
        "https://bildy-rpmaya.koyeb.app/api/client",
        clientData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Cliente creado exitosamente.");
      setClients([...clients, response.data]);
      setShowCreateForm(false);
      setClientDetails(response.data);
      setShowClientDetails(true);
    } catch (error) {
      console.error("Error al crear cliente:", error.response?.data || error.message);
      setMessage("Error al crear cliente. Intenta nuevamente.");
    }
  };

  const handleDeleteClient = async (id) => {
    const token = localStorage.getItem("jwt");
    try {
      await axios.delete(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Cliente eliminado exitosamente.");
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error("Error al eliminar cliente:", error.response?.data || error.message);
      setMessage("Error al eliminar cliente. Intenta nuevamente.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeClientDetails = () => {
    setShowClientDetails(false);
    setClientDetails(null);
  };

  const handleViewDetails = (client) => {
    // Excluir claves no deseadas
    const filteredClientDetails = Object.entries(client).reduce((acc, [key, value]) => {
      if (!["deleted", "active", "project"].includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {});

    setClientDetails(filteredClientDetails);
    setShowClientDetails(true);
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
      <div style={{ width: "45%", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h1 style={{ color: "#4CAF50", fontSize: "28px", marginBottom: "20px" }}>Gestión de Clientes</h1>
        {message && <p style={{ fontSize: "18px", color: "#D32F2F", fontWeight: "bold" }}>{message}</p>}

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "5px",
            marginBottom: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          {showCreateForm ? "Cancelar" : "Crear Cliente"}
        </button>

        {showCreateForm && (
          <form onSubmit={handleCreateClient}>
            {["name", "cif", "street", "number", "postal", "city", "province"].map((field, index) => (
              <input
                key={index}
                type={field === "number" || field === "postal" ? "number" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  fontSize: "16px",
                  color: "black",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            ))}
            <button
              type="submit"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "5px",
                width: "100%",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Crear Cliente
            </button>
          </form>
        )}
      </div>

      <div style={{ width: "50%", padding: "20px" }}>
        <h2 style={{ color: "#4CAF50", fontSize: "24px" }}>Lista de Clientes</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", color: "black" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "16px", textAlign: "left" }}>Nombre</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "16px", textAlign: "left" }}>CIF</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "16px", textAlign: "left" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    color: "#4CAF50",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleViewDetails(client)}
                >
                  {client.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd", color: "#4CAF50", fontWeight: "bold" }}>
                  {client.cif}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleDeleteClient(client._id)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showClientDetails && clientDetails && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
            width: "80%",
            maxWidth: "500px",
          }}
        >
          <h2 style={{ color: "#4CAF50", fontSize: "24px" }}>Detalles del Cliente</h2>
          {Object.entries(clientDetails).map(([key, value]) => (
            <p key={key} style={{ color: "#4CAF50", fontSize: "16px" }}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
              {typeof value === "object" ? JSON.stringify(value) : value}
            </p>
          ))}
          <button
            onClick={closeClientDetails}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientesPage;
