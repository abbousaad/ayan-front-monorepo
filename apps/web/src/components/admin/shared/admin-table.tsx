import type { ReactNode } from 'react';

type Column<T> = {
  header: string;
  render: (item: T) => ReactNode;
  width?: string;
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
};

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No items found.'
}: AdminTableProps<T>): React.JSX.Element {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '2px solid #e7e5e4', // stone-200
              textAlign: 'left'
            }}
          >
            {columns.map((col) => (
              <th
                key={col.header}
                style={{
                  padding: '12px 16px',
                  fontWeight: '600',
                  color: '#57534e', // stone-600
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: col.width
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: '#78716c' // stone-500
                }}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: '#78716c'
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                style={{ borderBottom: '1px solid #e7e5e4' }}
              >
                {columns.map((col) => (
                  <td
                    key={col.header}
                    style={{ padding: '12px 16px', color: '#1c1917' }}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export type { Column };
