"use client"; // Marca este componente como cliente

import { useState } from "react";
import axios from "axios";

export default function Register() {
  // Estados del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Estados para la validación
  const [showValidation, setShowValidation] = useState(false); // Muestra la ventana de validación
  const [validationCode, setValidationCode] = useState(""); // Código de validación

  // Manejar el registro del usuario
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://bildy-rpmaya.koyeb.app/api/user/register", {
        firstName,
        lastName,
        email,
        password,
      });

      const token = response.data.token;
      // Guardar el token en localStorage
      localStorage.setItem("jwt", token);

      // Mostrar mensaje de éxito y ventana de validación
      setMessage("Registro exitoso. Verifica tu correo.");
      setShowValidation(true);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMessage("Error al registrar usuario. Intenta nuevamente.");
    }
  };

  // Manejar la validación del código
  const handleValidateCode = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt"); // Recuperar el token del localStorage

    try {
      const response = await axios.put(
        "https://bildy-rpmaya.koyeb.app/api/user/validation",
        { email, code: validationCode }, // Enviar el email y el código
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token en las cabeceras
          },
        }
      );

      setMessage("Validación exitosa. ¡Tu cuenta ha sido activada!");
      setShowValidation(false); // Cierra la ventana de validación
    } catch (error) {
      console.error("Error al validar el código:", error);
      setMessage("Error al validar el código. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Formulario de Registro */}
      <form onSubmit={handleRegister} className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Registro</h1>
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="block w-full mb-4 p-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="block w-full mb-4 p-3 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-4 p-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 p-3 border rounded"
          required
        />
        <button className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
          Registrar
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>

      {/* Ventana de Validación */}
      {showValidation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Validar Cuenta</h2>
            <p className="text-gray-600 mb-4">
              Ingresa el código de verificación enviado a tu correo electrónico.
            </p>
            <form onSubmit={handleValidateCode}>
              <input
                type="text"
                placeholder="Código de validación"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
                className="block w-full mb-4 p-3 border rounded"
                maxLength={6}
                required
              />
              <button className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                Validar
              </button>
              <button
                type="button"
                onClick={() => setShowValidation(false)}
                className="w-full mt-2 p-3 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
