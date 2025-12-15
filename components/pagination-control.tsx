'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PaginationControlProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export function PaginationControl({ 
  totalPages, 
  currentPage, 
  pageSize, 
  totalCount 
}: PaginationControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    params.set('pageSize', pageSize.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', value);
    params.set('page', '1'); // Reset to page 1 when size changes
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1 && totalCount <= 10) return null; // Hide if only 1 page and few items

  // Generate page numbers
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show current, first, last, and some siblings
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
        <span>共 {totalCount} 条记录</span>
        <div className="flex items-center gap-2 ml-4">
          <Label className="text-xs whitespace-nowrap">每页显示</Label>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href={createPageURL(currentPage - 1)} 
              aria-disabled={currentPage <= 1}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {pages.map((page, i) => (
            <PaginationItem key={i}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink 
                  href={createPageURL(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              href={createPageURL(currentPage + 1)}
              aria-disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
