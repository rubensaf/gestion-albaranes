import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./globals.css"

const Layout = ({ children }) => {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-neutral-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
};
export default Layout;
