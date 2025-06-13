
"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/types";
import { FileSpreadsheet } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    // Attempt to parse various date formats if necessary, or assume a consistent one
    const date = new Date(dateString);
    // Check if the date is valid, an additional check for YYYY-MM-DD which might be parsed as UTC by Date constructor
    if (isNaN(date.getTime()) || /^\d{4}-\d{2}-\d{2}$/.test(dateString) && date.getUTCDate() !== parseInt(dateString.split('-')[2])) {
       // If date is invalid or a YYYY-MM-DD that got timezone shifted, return original or re-parse carefully
       // For simplicity, just returning original if complex parsing isn't immediately robust
      return dateString;
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }); // Add timeZone UTC for consistency with YYYY-MM-DD
  };

  if (!transactions || transactions.length === 0) {
    // This component will not render anything if there are no transactions.
    // The parent component (StatementParserPage) will handle showing a message like "Upload a statement...".
    return null;
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-center flex items-center justify-center">
          <FileSpreadsheet className="mr-2 h-6 w-6 text-primary" />
          Extracted Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableCaption>A list of your recent transactions.</TableCaption>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right w-[150px]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index} aria-rowindex={index + 1}>
                  <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description || 'N/A'}</TableCell>
                  <TableCell className={`text-right font-medium ${transaction.amount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {transaction.amount !== undefined ? formatCurrency(transaction.amount) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

