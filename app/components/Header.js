const Header = () => {
    return (
      <header className="bg-gray-100 dark:bg-neutral-800 shadow-md py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-primary">Gestión de Albaranes</h1>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-800 dark:text-gray-200 bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <a
            href="/login"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition"
          >
            Registrarse
          </a>
        </div>
      </header>
    );
  };
  
  export default Header;
  