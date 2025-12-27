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
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-[#0a0a0a] text-sm font-medium tracking-normal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a0a0a] hover:text-[#fafafa] transition-all rounded-[10px] disabled:hover:bg-transparent disabled:hover:text-[#0a0a0a]"
      >
        Prev
      </button>
      <span className="text-sm font-medium tracking-normal">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-[#0a0a0a] text-sm font-medium tracking-normal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a0a0a] hover:text-[#fafafa] transition-all rounded-[10px] disabled:hover:bg-transparent disabled:hover:text-[#0a0a0a]"
      >
        Next
      </button>
    </div>
  );
}
