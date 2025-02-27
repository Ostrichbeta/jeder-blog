"use client";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
} from "@/components/ui/pagination";

interface PaginationControlProps {
    totalItems: number;
    currentPage: number;
    maxItemPerPage: number;
    maxItemChoices: number[];
    onPageChange: (newPage: number) => void;
    onMaxItemChange: (value: string) => void;
}

export function PaginationControl({
    totalItems,
    currentPage,
    maxItemPerPage,
    maxItemChoices,
    onPageChange,
    onMaxItemChange,
}: PaginationControlProps) {
    const totalPages = Math.ceil(totalItems / maxItemPerPage);

    if (totalPages <= 0) return null;

    let startPage = 1;
    let endPage = totalPages;
    if (totalPages > 3) {
        if (currentPage >= totalPages - 1) {
            startPage = totalPages - 2;
            endPage = totalPages;
        } else {
            startPage = Math.max(1, currentPage - 1);
            endPage = Math.min(startPage + 2, totalPages);
        }
    }

    return (
        <div className="mt-auto pt-4">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-4 pt-4">
                <Pagination className="w-full md:w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(currentPage - 1);
                                }}
                            />
                        </PaginationItem>
                        {Array.from(
                            { length: endPage - startPage + 1 },
                            (_, i) => i + startPage,
                        ).map((pageNumber) => (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(pageNumber);
                                    }}
                                    isActive={pageNumber === currentPage}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

                <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-normal md:mt-0 mt-4">
                    <Label
                        htmlFor="maxitem"
                        className="text-sm text-muted-foreground text-nowrap"
                    >
                        Items per page
                    </Label>
                    <Select
                        value={maxItemPerPage.toString()}
                        onValueChange={onMaxItemChange}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder={maxItemPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                            {maxItemChoices.map((choice) => (
                                <SelectItem
                                    key={choice}
                                    value={choice.toString()}
                                >
                                    {choice}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
