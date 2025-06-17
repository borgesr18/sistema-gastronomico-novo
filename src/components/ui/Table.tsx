'use client';

import React, { ReactNode } from 'react';

export interface TableProps {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
}

export function Table({ headers, children, emptyMessage }: TableProps) {
  const isEmpty = Array.isArray(children) ? children.length === 0 : !children;

  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty && emptyMessage ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-2 text-center text-sm text-gray-500">
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

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-t">{children}</tr>;
}

export function TableCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-2 text-sm text-gray-700 ${className}`}>{children}</td>;
}
