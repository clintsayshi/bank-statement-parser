
"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { parseBankStatement, type ParseBankStatementOutput } from "@/ai/flows/parse-bank-statement";
import { UploadCloud, Loader2, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";


interface FileUploadProps {
  onParsedStatementData: (data: ParseBankStatementOutput) => void;
  onProcessing: (isProcessing: boolean) => void;
}

export function FileUpload({ onParsedStatementData, onProcessing }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/pdf" || file.type === "text/csv") {
        setSelectedFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF or CSV file.",
        });
        setSelectedFile(null);
        if (event.target) {
         event.target.value = ""; // Reset file input
        }
      }
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a bank statement file to upload.",
      });
      return;
    }

    setIsParsing(true);
    onProcessing(true);
    // Clear previous data by sending an empty structure
    onParsedStatementData({ transactions: [] });


    try {
      const dataUri = await fileToDataUri(selectedFile);
      const result: ParseBankStatementOutput = await parseBankStatement({ statementDataUri: dataUri });
      
      if (result && result.transactions) {
        onParsedStatementData(result);
        toast({
          title: "Success",
          description: "Bank statement parsed successfully.",
        });
      } else {
         // This case might indicate an issue with the AI's response structure
        onParsedStatementData({ 
            transactions: [],
            accountHolderName: undefined,
            accountNumber: undefined,
            bankAddress: undefined,
            bankName: undefined,
            statementPeriod: undefined 
        });
        throw new Error("Failed to parse transactions or received incomplete data from AI.");
      }

    } catch (error) {
      console.error("Error parsing bank statement:", error);
      toast({
        variant: "destructive",
        title: "Parsing Error",
        description: (error instanceof Error ? error.message : "An unknown error occurred while parsing the statement. Please ensure the file is a valid bank statement."),
      });
      onParsedStatementData({ 
        transactions: [],
        accountHolderName: undefined,
        accountNumber: undefined,
        bankAddress: undefined,
        bankName: undefined,
        statementPeriod: undefined
      });
    } finally {
      setIsParsing(false);
      onProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">Upload Bank Statement</CardTitle>
        <CardDescription className="text-center">
          Select a PDF or CSV file to extract transactions and details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="bank-statement" className="sr-only">Bank Statement</Label>
          <Input 
            id="bank-statement" 
            type="file" 
            accept=".pdf,.csv" 
            onChange={handleFileChange} 
            className="file:text-primary file:font-medium file:mr-3"
            aria-label="Bank statement file input"
          />
        </div>
        {selectedFile && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground p-2 border rounded-md bg-secondary">
            <FileText className="w-5 h-5 text-primary" />
            <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
          </div>
        )}
        <Button 
          onClick={handleFileUpload} 
          disabled={isParsing || !selectedFile} 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          aria-live="polite"
        >
          {isParsing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Parse Statement
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

