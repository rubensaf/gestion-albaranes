const Sidebar = () => {
    const menuItems = [
      { name: "Resumen", href: "/Resumen" },
      { name: "Clientes", href: "/clientes" },
      { name: "Proyectos", href: "/proyectos" },
      { name: "Albaranes", href: "/albaranes" },
    ];
  
    return (
      <aside className="w-64 bg-secondary text-neutral-100 dark:bg-neutral-800 min-h-screen p-4 flex flex-col">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="block py-2 px-3 rounded-lg mb-2 text-sm font-medium bg-transparent hover:bg-primary hover:text-white transition"
          >
            {item.name}
          </a>
        ))}
      </aside>
    );
  };
  
  export default Sidebar;
  