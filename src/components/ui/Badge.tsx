import type { ReactNode } from 'react';

const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    customer: 'bg-blue-100 text-blue-800',
    admin: 'bg-purple-100 text-purple-800',
    superadmin: 'bg-orange-100 text-orange-800',
    percentage: 'bg-cyan-100 text-cyan-800',
    fixed: 'bg-pink-100 text-pink-800',
    credit: 'bg-green-100 text-green-800',
    debit: 'bg-red-100 text-red-800',
};

interface Props {
    label: string | ReactNode;
    color?: string;
}

export default function Badge({ label, color }: Props) {
    const className =
        color ||
        colors[String(label).toLowerCase()] ||
        'bg-gray-100 text-gray-800';
    return (
        <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${className}`}
        >
            {label}
        </span>
    );
}
