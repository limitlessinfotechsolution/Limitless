import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie';
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  color: string;
}

interface EnterpriseReportingProps {
  reports?: ReportData[];
  title?: string;
  onFilterChange?: (filters: any) => void;
  onExport?: () => void;
}

const EnterpriseReporting: React.FC<EnterpriseReportingProps> = ({
  reports = [],
  title = "Business Analytics",
  onFilterChange,
  onExport
}) => {
  const [activeReport, setActiveReport] = useState(0);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    if (onFilterChange) {
      onFilterChange({ dateRange: newDateRange });
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  const renderChart = (report: ReportData) => {
    const { type, data, xAxisKey, yAxisKey, color } = report;

    switch (type) {
      case 'bar':
        return (
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxisKey} fill={color} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxisKey} stroke={color} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yAxisKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  if (reports.length === 0) {
    return (
      <div className="enterprise-reporting">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-gray-600">No reports</p>
        </div>
      </div>
    );
  }

  const currentReport = reports[activeReport];

  return (
    <div className="enterprise-reporting">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {/* Date Filters */}
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="start-date"
            data-testid="start-date-input"
            value={dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="end-date"
            data-testid="end-date-input"
            value={dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Export
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="mb-4">
        <div className="flex space-x-1">
          {reports.map((report, index) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(index)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeReport === index
                  ? 'bg-white border-t border-l border-r text-blue-600'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              {report.title}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">{currentReport.title}</h3>
        <p className="text-gray-600 mb-4">{currentReport.description}</p>
        <div className="flex justify-center">
          {renderChart(currentReport)}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseReporting;
