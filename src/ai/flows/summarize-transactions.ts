// Summarize transaction details for a bank statement.
'use server';

/**
 * @fileOverview Summarizes monthly spending from bank transactions using GenAI.
 *
 * - summarizeTransactions - A function that summarizes the transactions.
 * - SummarizeTransactionsInput - The input type for the summarizeTransactions function.
 * - SummarizeTransactionsOutput - The return type for the summarizeTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransactionsInputSchema = z.object({
  transactions: z.string().describe('The transaction details from the bank statement.'),
  month: z.string().describe('The month for the transaction summary.'),
});
export type SummarizeTransactionsInput = z.infer<typeof SummarizeTransactionsInputSchema>;

const SummarizeTransactionsOutputSchema = z.object({
  totalExpenses: z.number().describe('The total expenses for the month.'),
  topSpendingCategories: z
    .string()
    .describe('The top spending categories for the month.'),
  unusualTransactions: z.string().describe('Any unusual transactions for the month.'),
  summary: z.string().describe('A summary of the transaction details.'),
});
export type SummarizeTransactionsOutput = z.infer<typeof SummarizeTransactionsOutputSchema>;

export async function summarizeTransactions(input: SummarizeTransactionsInput): Promise<SummarizeTransactionsOutput> {
  return summarizeTransactionsFlow(input);
}

const summarizeTransactionsPrompt = ai.definePrompt({
  name: 'summarizeTransactionsPrompt',
  input: {schema: SummarizeTransactionsInputSchema},
  output: {schema: SummarizeTransactionsOutputSchema},
  prompt: `You are an expert financial analyst.

You will analyze the provided bank transactions for the month of {{month}} and provide a summary of the user's spending habits.

Your summary should include the total expenses, top spending categories, and any unusual transactions.

Transactions:
{{transactions}}`,
});

const summarizeTransactionsFlow = ai.defineFlow(
  {
    name: 'summarizeTransactionsFlow',
    inputSchema: SummarizeTransactionsInputSchema,
    outputSchema: SummarizeTransactionsOutputSchema,
  },
  async input => {
    const {output} = await summarizeTransactionsPrompt(input);
    return output!;
  }
);
