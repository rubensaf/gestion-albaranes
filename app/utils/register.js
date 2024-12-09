// pages/api/register.js
import { registerUser } from "../../utils/auth"; // Importamos la función de registro desde utils/auth.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password } = req.body;

    try {
      const { token } = await registerUser(firstName, lastName, email, password);
      res.status(200).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
