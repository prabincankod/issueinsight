"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

// import { PaginationData } from '@/types/types'
import { EditIcon, EyeIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
// import { Pagination } from '..'
import { Button } from "./button";
import { Pagination } from "./pagination";

type ActionOptions = "edit" | "view";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  actions?: {
    action: ActionOptions;
    url?: string;
    handleAction?: (row: TData) => void;
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  actions,
  loading = false,
  // @ts-ignore
  paginationData,
}: DataTableProps<TData, TValue>) {
  if (actions?.length && !columns.find((column) => column.id === "actions"))
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            {actions.map((action) => {
              return (
                <Button
                  key={action.action}
                  variant="ghost"
                  className="px-2"
                  asChild
                >
                  <div className="flex items-center justify-center">
                    {action.action === "view" && (
                      <div>
                        {action.url ? (
                          <Link href={action.url}>
                            <EyeIcon className="h-5 w-5 hover:cursor-pointer" />
                          </Link>
                        ) : (
                          <>
                            <EyeIcon
                              className="h-5 w-5 hover:cursor-pointer"
                              onClick={() =>
                                action.handleAction
                                  ? action.handleAction(row.original)
                                  : null
                              }
                            />
                          </>
                        )}
                      </div>
                    )}
                    {action.action === "edit" && (
                      <div>
                        {action.url ? (
                          <Link href={action.url}>
                            <EditIcon className="h-5 w-5 hover:cursor-pointer" />
                          </Link>
                        ) : (
                          <>
                            <EditIcon
                              className="h-5 w-5 hover:cursor-pointer"
                              onClick={() =>
                                action.handleAction
                                  ? action.handleAction(row.original)
                                  : null
                              }
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        );
      },
    });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="text-neutral-cool-600 bg-primary-foreground text-left uppercase">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="relative">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="pl-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loading ? "" : "No results"}
              </TableCell>
            </TableRow>
          )}
          {loading && (
            <div className="absolute left-0 top-0 grid h-full w-full place-content-center bg-slate-50 opacity-50">
              <Loader2Icon className="h-10 w-10 animate-spin" />
            </div>
          )}
        </TableBody>
        {paginationData && (
          <TableFooter className="border-t">
            <TableRow>
              <TableCell colSpan={6} className="p-0">
                {/* @ts-ignore */}
                <Pagination paginationData={paginationData} />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}