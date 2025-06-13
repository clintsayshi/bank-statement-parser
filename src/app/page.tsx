"use client";

import { useState } from "react";
import { FileUpload } from "@/components/feature/file-upload";
import { TransactionTable } from "@/components/feature/transaction-table";
import { ExportButtons } from "@/components/feature/export-buttons";
import type { Transaction } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // For loading skeleton

export default function StatementParserPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransactionsParsed = (parsedTransactions: Transaction[]) => {
    setTransactions(parsedTransactions);
  };

  const handleProcessingState = (processing: boolean) => {
    setIsProcessing(processing);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      <header className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Statement Parser
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload your bank statement (PDF or CSV) to easily extract and view your transactions.
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <FileUpload 
          onTransactionsParsed={handleTransactionsParsed} 
          onProcessing={handleProcessingState}
        />

        {isProcessing && (
          <div className="mt-8 w-full">
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <div className="space-y-3 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        )}

        {!isProcessing && (
          <>
            <TransactionTable transactions={transactions} />
            {transactions.length > 0 && (
              <>
                <Separator className="my-8" />
                <ExportButtons transactions={transactions} fileNamePrefix="bank_statement_transactions" />
              </>
            )}
          </>
        )}
      </main>

      <footer className="w-full max-w-3xl text-center mt-12 py-4 border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Statement Parser. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
