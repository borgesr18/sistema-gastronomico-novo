import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  emptyMessage?: string;
  children: React.ReactNode;
}

export function Table({ headers, emptyMessage, children, className, ...props }: TableProps) {
  return (
    <table className={`w-full text-left border-collapse ${className ?? ''}`} {...props}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-2 border-b font-bold text-gray-700">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          emptyMessage && (
            <tr>
              <td colSpan={headers.length} className="px-4 py-2 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export function TableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-2 border-b ${className ?? ''}`} {...props}>
      {children}
    </td>
  );
}
