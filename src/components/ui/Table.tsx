import type { ReactNode } from 'react';

interface Column<T> {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
}

interface Props<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
}

export default function Table<T extends Record<string, unknown>>({
    columns,
    data,
    onRowClick,
}: Props<T>) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="text-left px-4 py-3 font-medium text-gray-600"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr
                            key={(item.id as string) || i}
                            className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${
                                onRowClick ? 'cursor-pointer' : ''
                            }`}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-4 py-3 text-gray-700"
                                >
                                    {col.render(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
