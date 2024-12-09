
const { verifyCode } = require("../utils/auth");
export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { email, code } = req.body;
    const token = req.headers['authorization'].split(' ')[1]; // Obtén el token del encabezado

    try {
      // Verificar si el código es correcto
      const isValid = verifyCode(email, code);
      if (isValid) {
        // Aquí deberías actualizar la base de datos para marcar al usuario como verificado
        res.status(200).json({ message: 'Correo verificado exitosamente.' });
      } else {
        res.status(400).json({ message: 'Código incorrecto.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error en la verificación.' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
