'use client';

import React from 'react';
import DataGrid from './DataGrid';
import { ColumnDef } from '@tanstack/react-table';

// Example data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// Example columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        info.getValue() === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
  },
];

const DataGridExample: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Grid Example</h1>

      <DataGrid<User>
        baseUrl="/api/users" // Replace with your actual API endpoint
        columns={columns}
        pageSize={10}
        className="w-full"
      />
    </div>
  );
};

export default DataGridExample;
