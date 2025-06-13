
"use client";

import { useState } from "react";
import { FileUpload } from "@/components/feature/file-upload";
import { TransactionTable } from "@/components/feature/transaction-table";
import { ExportButtons } from "@/components/feature/export-buttons";
import type { Transaction } from "@/types";
import type { ParseBankStatementOutput } from "@/ai/flows/parse-bank-statement";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Banknote, UserCircle, Landmark, CalendarDays, MapPin } from "lucide-react";

type BankMetadata = Omit<ParseBankStatementOutput, "transactions">;

export default function StatementParserPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankMetadata, setBankMetadata] = useState<BankMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleParsedStatementData = (parsedData: ParseBankStatementOutput) => {
    const { transactions: parsedTransactions, ...metadata } = parsedData;
    setTransactions(parsedTransactions || []);
    setBankMetadata(metadata);
  };

  const handleProcessingState = (processing: boolean) => {
    setIsProcessing(processing);
  };

  const hasMetadata = bankMetadata && Object.values(bankMetadata).some(value => value !== undefined && value !== null && value !== '');

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      <header className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Statement Parser
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload your bank statement (PDF or CSV) to easily extract and view your transactions and statement details.
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <FileUpload 
          onParsedStatementData={handleParsedStatementData} 
          onProcessing={handleProcessingState}
        />

        {isProcessing && (
          <div className="mt-8 w-full">
            {/* Skeleton for metadata card */}
            <Skeleton className="h-40 w-full mb-4" />
            {/* Skeleton for table title */}
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
            {hasMetadata && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-xl font-headline flex items-center">
                    <Banknote className="mr-2 h-6 w-6 text-primary" />
                    Statement Details
                  </CardTitle>
                  <CardDescription>
                    Key information extracted from your bank statement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {bankMetadata.bankName && (
                    <div className="flex items-start">
                      <Landmark className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="font-medium">Bank Name:</span> {bankMetadata.bankName}
                      </div>
                    </div>
                  )}
                  {bankMetadata.accountHolderName && (
                    <div className="flex items-start">
                      <UserCircle className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                       <div>
                        <span className="font-medium">Account Holder:</span> {bankMetadata.accountHolderName}
                      </div>
                    </div>
                  )}
                  {bankMetadata.accountNumber && (
                    <div className="flex items-start">
                      <Landmark className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" /> {/* Using Landmark as a generic bank icon */}
                       <div>
                        <span className="font-medium">Account Number:</span> {bankMetadata.accountNumber}
                      </div>
                    </div>
                  )}
                  {bankMetadata.statementPeriod && (
                    <div className="flex items-start">
                      <CalendarDays className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                       <div>
                        <span className="font-medium">Statement Period:</span> {bankMetadata.statementPeriod}
                      </div>
                    </div>
                  )}
                  {bankMetadata.bankAddress && (
                    <div className="flex items-start md:col-span-2">
                      <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="font-medium">Bank Address:</span> {bankMetadata.bankAddress}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <TransactionTable transactions={transactions} />
            
            {transactions.length > 0 && (
              <>
                <Separator className="my-8" />
                <ExportButtons transactions={transactions} fileNamePrefix="bank_statement_transactions" />
              </>
            )}
            
            {!hasMetadata && transactions.length === 0 && !isProcessing && (
               <Card className="w-full mt-8">
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Upload a statement to view transactions and details.
                  </p>
                </CardContent>
              </Card>
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

