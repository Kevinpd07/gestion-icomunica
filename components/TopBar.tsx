'use client'; // Necesita interactividad

export default function TopBar() {
  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
            Crear Usuarios
          </button>
          <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
            Gestión de Usuarios
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded">
            Gestión de Uniones
          </button>
        </div>
      </div>
    </div>
  );
}