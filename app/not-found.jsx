"use client";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl font-semibold mb-6">Página no encontrada</p>
      <p className="text-lg text-gray-400 mb-8">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link href="/" className="py-3 px-6 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;
