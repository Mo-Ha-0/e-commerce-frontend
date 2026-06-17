interface Props {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            p === page
              ? "bg-indigo-600 text-white border-indigo-600"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
