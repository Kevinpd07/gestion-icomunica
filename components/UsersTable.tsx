'use client';

import { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';

interface User {
  id: number;
  nombre: string;
  usuario: string;
  organismo: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
}

// Datos de ejemplo
const initialData: User[] = [
  { id: 1, nombre: 'Juan Pérez', usuario: 'jperez', organismo: 'Ministerio A', estado: 'Activo' },
  { id: 2, nombre: 'María García', usuario: 'mgarcia', organismo: 'Secretaría B', estado: 'Inactivo' },
  { id: 3, nombre: 'Carlos López', usuario: 'clopez', organismo: 'Departamento C', estado: 'Pendiente' },
  { id: 4, nombre: 'Ana Martínez', usuario: 'amartinez', organismo: 'Ministerio A', estado: 'Activo' },
  { id: 5, nombre: 'Pedro Rodríguez', usuario: 'prodriguez', organismo: 'Secretaría B', estado: 'Activo' },
  { id: 6, nombre: 'Laura Sánchez', usuario: 'lsanchez', organismo: 'Departamento C', estado: 'Inactivo' },
];

// Columnas de la tabla
const columns = [
  {
    name: 'Nombre',
    selector: (row: User) => row.nombre,
    sortable: true,
    cell: (row: User) => <div className="font-medium">{row.nombre}</div>,
  },
  {
    name: 'Usuario',
    selector: (row: User) => row.usuario,
    sortable: true,
  },
  {
    name: 'Organismo',
    selector: (row: User) => row.organismo,
    sortable: true,
  },
  {
    name: 'Estado',
    selector: (row: User) => row.estado,
    cell: (row: User) => (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
        row.estado === 'Activo' ? 'bg-green-100 text-green-800' :
        row.estado === 'Inactivo' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {row.estado}
      </span>
    ),
    sortable: true,
  },
  {
  name: 'Operaciones',
  cell: (row: User) => (
    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
      <button
        onClick={() => console.log(`Eliminar usuario ${row.id}`)}
        type="button"
        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-1"
      >
        <i className="fas fa-trash-alt text-xs"></i>
        
      </button>
      <button
        onClick={() => console.log(`Editar usuario ${row.id}`)}
        type="button"
        className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-1"
      >
        <i className="fas fa-user-edit text-xs"></i>
        
      </button>
      <button
        onClick={() => console.log(`Cambiar contraseña ${row.id}`)}
        type="button"
        className="px-3 py-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors text-sm flex items-center justify-center gap-1"
      >
        <i className="fas fa-key text-xs"></i>
        
      </button>
      <button
        onClick={() => console.log(`Vincular usuario ${row.id}`)}
        type="button"
        className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-1"
      >
        <i className="fas fa-link text-xs"></i>
        
      </button>
    </div>
  ),
  ignoreRowClick: true,
  width: '300px',
}
];

// Estilos personalizados
const customStyles = {
  headCells: {
    style: {
      backgroundColor: '#f8fafc',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#374151',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottom: '2px solid #e5e7eb',
    },
  },
  cells: {
    style: {
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #f3f4f6',
    },
  },
  rows: {
    style: {
      '&:hover': {
        backgroundColor: '#f9fafb',
      },
    },
  },
};

export default function UsersTable() {
  // Estados para filtros
  const [filterText, setFilterText] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Filtrar datos
  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      // Filtro de búsqueda general
      const matchesSearch = filterText === '' || 
        item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
        item.usuario.toLowerCase().includes(filterText.toLowerCase()) ||
        item.organismo.toLowerCase().includes(filterText.toLowerCase());

      // Filtro por estado
      const matchesEstado = filterEstado === 'todos' || 
        item.estado.toLowerCase() === filterEstado.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [filterText, filterEstado]);

  // Componente de subheader con filtros
  const SubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      setFilterText('');
      setFilterEstado('todos');
      setResetPaginationToggle(!resetPaginationToggle);
    };

    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Barra de búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, usuario u organismo..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-4">
          <select
            value={filterEstado}
            onChange={e => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="pendiente">Pendiente</option>
          </select>

          {/* Botón limpiar filtros */}
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    );
  }, [filterText, filterEstado, resetPaginationToggle]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-2">Lista de Usuarios</h2>
      <p className="text-gray-600 mb-6">Total de usuarios: {filteredData.length}</p>
      
      {/* Componente de filtros */}
      {SubHeaderComponent}

      {/* Tabla con DataTables */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        highlightOnHover
        responsive
        customStyles={customStyles}
        noDataComponent={
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron resultados</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterText || filterEstado !== 'todos' 
                ? 'Prueba con otros términos de búsqueda o filtros diferentes.'
                : 'No hay usuarios registrados en el sistema.'}
            </p>
          </div>
        }
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
          selectAllRowsItem: true,
          selectAllRowsItemText: 'Todos',
        }}
      />
    </div>
  );
}