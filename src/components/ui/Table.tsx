'use client';

import React from 'react';

export interface TableProps {
  headers: string[];
  children: React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Table({ headers, children, emptyMessage, isLoading }: TableProps) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="text-left px-3 py-2 font-semibold text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                Carregando...
              </td>
            </tr>
          ) : React.Children.count(children) > 0 ? (
            children
          ) : emptyMessage ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export function TableRow({ children, className = '', ...props }: TableRowProps) {
  return (
    <tr className={`border-b ${className}`} {...props}>
      {children}
    </tr>
  );
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`px-3 py-2 ${className}`} {...props}>
      {children}
    </td>
  );
}
