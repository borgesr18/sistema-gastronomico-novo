'use client';

import React, { HTMLAttributes } from 'react';

export interface TableProps {
  headers: string[];
  children: React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Table({ headers, children, emptyMessage, isLoading }: TableProps) {
  if (isLoading) {
    return <p className="text-center py-4">Carregando...</p>;
  }

  const isEmpty = React.Children.count(children) === 0;

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isEmpty && emptyMessage ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-2 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

export function TableCell({
  children,
  ...rest
}: { children: React.ReactNode } & HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="px-4 py-2" {...rest}>
      {children}
    </td>
  );
}
