import React, { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

const Table: React.FC<TableProps> = ({
  headers,
  children,
  className = '',
  emptyMessage = 'Nenhum dado encontrado',
  isLoading = false,
}) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                <div className="flex justify-center items-center py-4">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Carregando...</span>
                </div>
              </td>
            </tr>
          ) : React.Children.count(children) > 0 ? (
            children
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>;
};

export const TableCell: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <td className={`px-6 py-4 text-sm text-gray-500 ${className}`}>{children}</td>;
};

export default Table;
