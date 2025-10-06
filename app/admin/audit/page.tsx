'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, Filter, Calendar, User, Activity, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination';
import { ExportModal } from '@/components/admin/ExportModal';
import { auditLogger, AuditLogEntry } from '@/lib/auditLogger';
import { AuditLogQuery } from '@/types';

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<AuditLogQuery>({
    filters: {},
    pagination: { page: 1, limit: 10 },
    sort: { field: 'timestamp', direction: 'desc' },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditLogger.getAuditLogs(query);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchLogs();
  }, [query, fetchLogs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setQuery(prev => ({ ...prev, filters: { ...prev.filters, search: searchTerm }, pagination: { ...prev.pagination, page: 1 } }));
      } else {
        setQuery(prev => ({ ...prev, filters: { ...prev.filters, search: undefined }, pagination: { ...prev.pagination, page: 1 } }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, pagination: { ...prev.pagination, page } }));
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionBadge = (action: string) => {
    return <Badge variant="secondary">{action}</Badge>;
  };

  if (loading) return <div className="p-8">Loading audit logs...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Monitor and review all system activities and admin actions.</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Filters
            <Button variant="ghost" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="create">Create</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">Date Range</span>
              {/* Add date picker here */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Audit Log Entries ({logs.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setQuery(prev => ({ ...prev, sort: { field: 'timestamp', direction: 'asc' } }))}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.entityId || log.timestamp}>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell><Badge variant="secondary">{log.entity}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {log.userId ? `User ${log.userId.slice(-4)}` : 'System'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {log.details && Object.entries(log.details as Record<string, unknown>).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{log.ipAddress || 'N/A'}</TableCell>
                  <TableCell>{formatTimestamp(log.timestamp!)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {logs.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No audit logs found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => handlePageChange(query.pagination.page - 1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              Page {query.pagination.page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={() => handlePageChange(query.pagination.page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={logs}
        onExport={(format) => {
          // Implement export logic using exportUtils
          console.log('Exporting audit logs as', format);
        }}
      />
    </div>
  );
};

export default AuditLogsPage;
