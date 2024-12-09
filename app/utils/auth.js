// utils/auth.js
const jwt = require('jsonwebtoken');

// Crear un token JWT
const createToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email }, // Payload del token
    'your_secret_key', // La clave secreta de tu JWT
    { expiresIn: '1h' } // El token expira en 1 hora
  );
};

const registerUser = async (email, password) => {
  // Aquí debes registrar al usuario en la base de datos
  const user = { id: 1, email }; // Suponiendo que creamos un usuario con id = 1

  const token = createToken(user); // Crear un token JWT para el usuario

  // Enviar correo con código de verificación y el token JWT
  const code = generateVerificationCode();
  sendVerificationEmail(email, code);

  return { token }; // Retorna el token JWT
};

// Función para generar un código de verificación
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generar un código de 6 dígitos
};

module.exports = { registerUser };
