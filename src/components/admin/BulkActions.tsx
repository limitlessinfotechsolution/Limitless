'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Checkbox } from '@/components/ui/Checkbox';
import { MoreHorizontal, Trash2, CheckCircle, EyeOff, Download } from 'lucide-react';
import { ExportFormat } from '@/types';
import { handleBulkAction } from '@/lib/adminUtils'; // Assume this is created

interface BulkActionsProps {
  selectedItems: string[];
  entity: 'testimonials' | 'leads' | 'projects';
  onSelectionChange: (selected: string[]) => void;
  data: unknown[];
  onExport: (format: ExportFormat) => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  entity,
  onSelectionChange,
  data,
  onExport,
}) => {
  const isSelected = selectedItems.length > 0;

  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(item => (item as { id: string }).id));
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedItems.length} ${entity}?`)) {
      await handleBulkAction('delete', selectedItems, entity);
      onSelectionChange([]);
    }
  };

  const handleBulkApprove = async () => {
    await handleBulkAction('approve', selectedItems, entity);
    onSelectionChange([]);
  };

  const handleBulkPublish = async () => {
    await handleBulkAction('publish', selectedItems, entity);
    onSelectionChange([]);
  };

  const handleBulkUnpublish = async () => {
    await handleBulkAction('unpublish', selectedItems, entity);
    onSelectionChange([]);
  };

  const handleExport = (format: ExportFormat) => {
    onExport(format);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-muted/40">
      <div className="flex items-center space-x-4">
        <Checkbox
          checked={selectedItems.length === data.length && data.length > 0}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
        <span className="text-sm font-medium">
          {selectedItems.length} of {data.length} selected
        </span>
        {isSelected && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <MoreHorizontal className="h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              {entity === 'testimonials' && (
                <DropdownMenuItem onClick={handleBulkApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
              )}
              {entity === 'projects' && (
                <>
                  <DropdownMenuItem onClick={handleBulkPublish}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Publish
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkUnpublish}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unpublish
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
                <DropdownMenu>
                  <DropdownMenuTrigger>Format</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport(ExportFormat.CSV)}>
                      CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport(ExportFormat.PDF)}>
                      PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        Bulk actions available when items are selected
      </div>
    </div>
  );
};
