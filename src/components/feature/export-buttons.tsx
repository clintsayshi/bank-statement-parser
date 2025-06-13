"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Transaction } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonsProps {
  transactions: Transaction[];
  fileNamePrefix?: string;
}

export function ExportButtons({ transactions, fileNamePrefix = "transactions" }: ExportButtonsProps) {
  const { toast } = useToast();

  const convertToCSV = (data: Transaction[]) => {
    const header = "Date,Description,Amount\n";
    const rows = data
      .map(tx => `"${String(tx.date || '').replace(/"/g, '""')}","${String(tx.description || '').replace(/"/g, '""')}","${String(tx.amount || 0)}"`)
      .join("\n");
    return header + rows;
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    try {
      const a = document.createElement("a");
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      document.body.appendChild(a); // Required for Firefox
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      toast({
        title: "Download Started",
        description: `${fileName} is being downloaded.`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Could not initiate file download.",
      });
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "There is no data to export.",
      });
      return;
    }
    const csvData = convertToCSV(transactions);
    downloadFile(csvData, `${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.csv`, "text/csv;charset=utf-8;");
  };

  const handleExportJSON = () => {
    if (transactions.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "There is no data to export.",
      });
      return;
    }
    const jsonData = JSON.stringify(transactions, null, 2);
    downloadFile(jsonData, `${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.json`, "application/json;charset=utf-8;");
  };

  if (!transactions || transactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
      <Button 
        onClick={handleExportCSV} 
        variant="outline" 
        className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        aria-label="Export transactions as CSV"
      >
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <Button 
        onClick={handleExportJSON} 
        variant="outline" 
        className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        aria-label="Export transactions as JSON"
      >
        <Download className="mr-2 h-4 w-4" />
        Export JSON
      </Button>
    </div>
  );
}
