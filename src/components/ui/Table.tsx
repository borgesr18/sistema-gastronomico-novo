'use client';

import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export function Table({ headers, children }: TableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 border">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">{children}</tbody>
    </table>
  );
}

interface TableRowProps {
  children: ReactNode;
}

export function TableRow({ children }: TableRowProps) {
  return <tr className="hover:bg-gray-50">{children}</tr>;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;  // ✅ Aqui permitimos className
}

export function TableCell({ children, className }: TableCellProps) {
  return <td className={clsx('px-4 py-2 text-sm text-gray-800', className)}>{children}</td>;
}
