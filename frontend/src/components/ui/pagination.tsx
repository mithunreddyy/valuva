interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
      >
        Previous
      </button>
      <span className="text-sm text-neutral-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
      >
        Next
      </button>
    </div>
  );
}
