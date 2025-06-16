'use client';

import React, { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export const TableRow = ({ children }: { children: ReactNode }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

export const TableCell = ({ children }: { children: ReactNode }) => (
  <td className="px-4 py-2 border-b text-sm text-gray-700">{children}</td>
);
