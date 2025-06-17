'use client';

import React, { HTMLAttributes } from 'react';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  headers: string[];
  emptyMessage?: string;
  className?: string;
}

export function Table({ headers, children, emptyMessage, className, ...props }: TableProps) {
  const hasData = React.Children.count(children) > 0;

  return (
    <table {...props} className={`min-w-full divide-y divide-gray-200 ${className`}`}>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {hasData ? children : (
          <tr>
            <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
              {emptyMessage || 'Nenhum dado encontrado.'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

export function TableCell({ children, ...props }: { children: React.ReactNode } & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...props} className={`px-6 py-4 whitespace-nowrap ${props.className || ''`}`}>
      {children}
    </td>
  );
}

)