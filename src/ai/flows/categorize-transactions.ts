// categorize-transactions.ts
'use server';
/**
 * @fileOverview Transaction categorization flow using Genkit.
 *
 * This file defines a Genkit flow that categorizes a list of transactions
 * into predefined categories such as groceries, utilities, and rent. It exports
 * the main function `categorizeTransactions` along with its input and output types.
 *
 * @exports categorizeTransactions - The main function to categorize transactions.
 * @exports CategorizeTransactionsInput - The input type for categorizeTransactions.
 * @exports CategorizeTransactionsOutput - The output type for categorizeTransactions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a single transaction
const TransactionSchema = z.object({
  date: z.string().describe('The date of the transaction.'),
  description: z.string().describe('A description of the transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
});

// Define the input schema for the categorizeTransactions function
const CategorizeTransactionsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('An array of transactions to categorize.'),
  categories: z.array(z.string()).describe('An array of possible categories to classify the transactions into.'),
});
export type CategorizeTransactionsInput = z.infer<typeof CategorizeTransactionsInputSchema>;

// Define the output schema for a single categorized transaction
const CategorizedTransactionSchema = TransactionSchema.extend({
  category: z.string().describe('The category of the transaction.'),
});

// Define the output schema for the categorizeTransactions function
const CategorizeTransactionsOutputSchema = z.array(CategorizedTransactionSchema);
export type CategorizeTransactionsOutput = z.infer<typeof CategorizeTransactionsOutputSchema>;

/**
 * Main function to categorize a list of transactions.
 * @param input - The input containing the transactions and categories.
 * @returns A promise that resolves to an array of categorized transactions.
 */
export async function categorizeTransactions(input: CategorizeTransactionsInput): Promise<CategorizeTransactionsOutput> {
  return categorizeTransactionsFlow(input);
}

// Define the prompt for categorizing transactions
const categorizeTransactionsPrompt = ai.definePrompt({
  name: 'categorizeTransactionsPrompt',
  input: {schema: CategorizeTransactionsInputSchema},
  output: {schema: CategorizeTransactionsOutputSchema},
  prompt: `You are a personal finance expert. Given a list of bank transactions, categorize each transaction into one of the following categories: {{{categories}}}.\n\nTransactions:\n{{#each transactions}}- Date: {{this.date}}, Description: {{this.description}}, Amount: {{this.amount}}\n{{/each}}\n\nReturn a JSON array of categorized transactions, including the original transaction details and the assigned category for each.
`,
});

// Define the Genkit flow for categorizing transactions
const categorizeTransactionsFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionsFlow',
    inputSchema: CategorizeTransactionsInputSchema,
    outputSchema: CategorizeTransactionsOutputSchema,
  },
  async input => {
    const {output} = await categorizeTransactionsPrompt(input);
    return output!;
  }
);
