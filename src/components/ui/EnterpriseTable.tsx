import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import Button from './Button';

interface Column {
  accessorKey: string;
  header: string;
}

interface EnterpriseTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  loading?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const EnterpriseTable: React.FC<EnterpriseTableProps> = ({
  data,
  columns,
  title,
  loading = false,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column, index) => (
                  <th key={index} className="text-left p-2 font-semibold">
                    {column.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="text-left p-2 font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr key={rowIndex} className="border-b hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-2">
                      {item[column.accessorKey]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="p-2 space-x-2">
                      {onEdit && (
                        <Button
                          onClick={() => onEdit(item)}
                          variant="outline"
                          size="sm"
                        >
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          onClick={() => onDelete(item)}
                          variant="destructive"
                          size="sm"
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseTable;
