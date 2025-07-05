import { memo, useMemo } from "react";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination = memo(({ currentPage, totalPages, setPage }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Memoize expensive page numbers calculation
  const pageNumbers = useMemo(() => {
    const pages = [];

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (rangeStart > 2) {
      pages.push("ellipsis1");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis2");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePrevious = () => setPage(Math.max(1, currentPage - 1));
  const handleNext = () => setPage(Math.min(totalPages, currentPage + 1));

  return (
    <PaginationUI className="mt-8" data-testid="pagination">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
            data-testid="pagination-prev"
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, i) => {
          if (pageNumber === "ellipsis1" || pageNumber === "ellipsis2") {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${pageNumber}`}>
              <PaginationLink
                onClick={() => setPage(pageNumber as number)}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
            data-testid="pagination-next"
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationUI>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
