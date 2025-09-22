# DataGrid Component

A powerful, flexible data grid component built with TanStack Table (React Table) that provides sorting, pagination, and column visibility controls.

## Features

- ✅ **Sorting**: Click column headers to sort data ascending/descending
- ✅ **Pagination**: Navigate through data with fixed page size of 10
- ✅ **Column Visibility**: Toggle column visibility with checkboxes
- ✅ **API Integration**: Fetches data from REST APIs with specific query parameters
- ✅ **Loading States**: Shows loading spinner during data fetching
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Dark Mode Support**: Compatible with dark/light themes
- ✅ **TypeScript**: Fully typed for better development experience

## API Query Parameters

The component automatically constructs query parameters for your API:

### Data Request
```
GET {baseUrl}?skip={pageIndex * pageSize}&take={pageSize}&requireTotalCount=true&sort=[{...}]
```

### Count Request
```
GET {baseUrl}?isCountQuery=true&requireTotalCount=true
```

### Sort Parameter Format
```json
[
  {
    "selector": "columnName",
    "desc": true
  }
]
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `baseUrl` | `string` | - | **Required.** Base URL for API endpoint |
| `columns` | `ColumnDef<T, any>[]` | - | **Required.** Column definitions for TanStack Table |
| `pageSize` | `number` | `10` | Fixed page size (cannot be changed) |
| `className` | `string` | `''` | Additional CSS classes |

## Expected API Response Format

### Data Response
```typescript
{
  data: T[],
  totalCount: number
}
```

### Count Response
```typescript
{
  totalCount: number
}
```

## Usage Example

```tsx
import React from 'react';
import DataGrid from './components/ui/DataGrid';
import { ColumnDef } from '@tanstack/react-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
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
];

const MyComponent = () => {
  return (
    <DataGrid<User>
      baseUrl="/api/users"
      columns={columns}
      className="w-full"
    />
  );
};
```

## Dependencies

- `@tanstack/react-table`: Core table functionality
- `lucide-react`: Icons for sorting and loading states
- `./Button`: Button component for pagination
- `./Checkbox`: Checkbox component for column visibility

## Styling

The component uses Tailwind CSS classes and supports:
- Light/dark mode theming
- Responsive design
- Custom styling via `className` prop

## Error Handling

- Network errors are logged to console
- Failed requests show empty data state
- Loading states prevent user interaction during fetches

## Performance

- Manual pagination prevents loading all data at once
- Efficient re-renders with React Table's optimization
- Separate count queries for accurate pagination info
