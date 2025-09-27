'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { ExportFormat } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: unknown[];
  onExport: (format: ExportFormat, data: unknown[]) => void;
}

export function ExportModal({ isOpen, onClose, data, onExport }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.CSV);

  const handleExport = () => {
    onExport(selectedFormat, data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose the format to export your data. The file will be downloaded automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="format" className="text-sm font-medium">
              Format
            </label>
            <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as ExportFormat)}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ExportFormat.CSV}>CSV</SelectItem>
                <SelectItem value={ExportFormat.PDF}>PDF</SelectItem>
                <SelectItem value={ExportFormat.JSON}>JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleExport}>
            Export {selectedFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
