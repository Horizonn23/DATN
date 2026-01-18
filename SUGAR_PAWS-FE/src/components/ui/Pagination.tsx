import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Hiển thị tối đa 5 trang, có ... nếu nhiều hơn
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 3) end = Math.min(5, totalPages);
    if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8 mb-8">
      <div className="flex items-center justify-center gap-1">
        {/* Previous Button */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FiChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {/* First page + ellipsis */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium text-gray-700"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            <div className="flex items-center justify-center w-10 h-10">
              <FiMoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          </>
        )}

        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 shadow-sm text-sm font-medium ${
              page === currentPage
                ? "bg-custom-rose text-white border-custom-rose shadow-lg transform scale-105"
                : "border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md text-gray-700"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* Last page + ellipsis */}
        {getPageNumbers().at(-1)! < totalPages && (
          <>
            <div className="flex items-center justify-center w-10 h-10">
              <FiMoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium text-gray-700"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="text-sm text-gray-500">
        Page <span className="font-medium text-custom-rose">{currentPage}</span>{" "}
        of <span className="font-medium">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
