import { getCurrentUser } from "@/actions/auth";
import { logoutAction } from "@/actions/auth";
import TopBar from "@/components/TopBar"; // Importa la barra superior
//import UsersTable from "@/components/UsersTable"; // Importa la tabla

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Barra Superior */}
      <TopBar />

      {/* 2. Contenedor Principal */}
      <div className="container mx-auto p-4">
        {/* 3. Información del Usuario */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold">Bienvenido, {user.username}</h1>
          <p className="text-gray-600">
            Email: {user.email} | Rol: {user.role}
          </p>
        </div>

        {/* 4. Tabla de Usuarios */}
        <div className="mb-6">{/* <UsersTable />*/}</div>

        {/* 5. Botón de Cerrar Sesión */}
        <div className="text-center">
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
