'use client';

import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import Button from './Button';
import Checkbox from './Checkbox';

interface DataGridProps<T> {
  baseUrl: string;
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  className?: string;
}

interface ApiResponse<T> {
  data: T[];
  totalCount: number;
}

interface SortItem {
  selector: string;
  desc?: boolean;
}

const DataGrid = <T extends Record<string, unknown>>({
  baseUrl,
  columns,
  pageSize = 10,
  className = '',
}: DataGridProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const fetchData = async (page: number, sort: SortingState) => {
    setLoading(true);
    try {
      // Build sort parameter
      const sortParam: SortItem[] = sort.map(s => ({
        selector: s.id,
        desc: s.desc,
      }));

      // Build query parameters
      const params = new URLSearchParams({
        skip: (page * pageSize).toString(),
        take: pageSize.toString(),
        requireTotalCount: 'true',
      });

      if (sortParam.length > 0) {
        params.append('sort', JSON.stringify(sortParam));
      }

      // First, get total count
      const countParams = new URLSearchParams({
        isCountQuery: 'true',
        requireTotalCount: 'true',
      });

      const [dataResponse, countResponse] = await Promise.all([
        fetch(`${baseUrl}?${params}`),
        fetch(`${baseUrl}?${countParams}`),
      ]);

      if (!dataResponse.ok || !countResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const dataResult: ApiResponse<T> = await dataResponse.json();
      const countResult: { totalCount: number } = await countResponse.json();

      setData(dataResult.data);
      setTotalCount(countResult.totalCount);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageIndex, sorting);
  }, [pageIndex, sorting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
      }
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Column Visibility Controls */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          Columns:
        </span>
        {table.getAllColumns().map((column) => (
          <Checkbox
            key={column.id}
            label={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={column.toggleVisibility}
            className="text-sm"
          />
        ))}
      </div>

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
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} results
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0 || loading}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1 || loading}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1 || loading}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
