import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
} from '@tanstack/react-table';
import { 
  ChevronUp, 
  ChevronDown, 
  Loader2,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  RefreshCw
} from 'lucide-react';
import Button from './Button';
import { Card } from '../ui/Card';

interface EnterpriseTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onAddNew?: () => void;
  onRefresh?: () => void;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  className?: string;
  title?: string;
  description?: string;
  loading?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
}

const EnterpriseTable = <T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onAddNew,
  onRefresh,
  searchable = true,
  filterable = true,
  exportable = true,
  pagination = true,
  itemsPerPage = 10,
  className = '',
  title,
  description,
  loading = false,
  onSearch,
  searchPlaceholder = 'Search...'
}: EnterpriseTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  
  // Add action column if any action handlers are provided
  const hasActions = !!(onEdit || onDelete || onView);
  
  const actionColumn: ColumnDef<T> = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {onView && (
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Eye className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
          >
            &nbsp;
          </Button>
        )}
        {onEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Edit className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            &nbsp;
          </Button>
        )}
        {onDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Trash2 className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original);
            }}
          >
            &nbsp;
          </Button>
        )}
        {!onView && !onEdit && !onDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<MoreHorizontal className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu open if needed
            }}
          >
            &nbsp;
          </Button>
        )}
      </div>
    ),
  };
  
  // Add action column to columns if actions are available
  const enhancedColumns = hasActions ? [...columns, actionColumn] : columns;

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize: itemsPerPage,
      },
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualPagination: false,
    pageCount: pagination ? Math.ceil(data.length / itemsPerPage) : -1,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize: itemsPerPage });
        setPageIndex(newState.pageIndex);
      }
    },
  });

  const handleSearch = (value: string) => {
    setGlobalFilter(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Card className={`p-6 ${className}`} variant="feature">
      {/* Header */}
      {(title || description || onAddNew || onRefresh || searchable || exportable) && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {title && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={globalFilter}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-accent focus:border-accent"
                  />
                </div>
              )}
              
              {filterable && (
                <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
                  Filter
                </Button>
              )}
              
              {exportable && (
                <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
                  Export
                </Button>
              )}
              
              {onRefresh && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={onRefresh}
                >
                  &nbsp;
                </Button>
              )}
              
              {onAddNew && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={<Plus className="w-4 h-4" />}
                  onClick={onAddNew}
                >
                  Add New
                </Button>
              )}
            </div>
          </div>
          
          {/* Column Visibility Controls */}
          <div className="flex flex-wrap gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Columns:
            </span>
            {table.getAllColumns().filter(column => column.id !== 'actions').map((column) => (
              <label key={column.id} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  className="mr-2 rounded text-accent focus:ring-accent"
                />
                {column.id}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-1 cursor-pointer select-none ${
                          header.column.getCanSort() ? 'hover:text-gray-700 dark:hover:text-gray-300' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={`w-3 h-3 ${
                                header.column.getIsSorted() === 'asc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                            <ChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={enhancedColumns.length} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={enhancedColumns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of {data.length} results
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnterpriseTable;
