'use server';

/**
 * @fileOverview A flow that extracts transaction details from a bank statement.
 *
 * - parseBankStatement - A function that handles the bank statement parsing process.
 * - ParseBankStatementInput - The input type for the parseBankStatement function.
 * - ParseBankStatementOutput - The return type for the parseBankStatement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseBankStatementInputSchema = z.object({
  statementDataUri: z
    .string()
    .describe(
      'A bank statement, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the expected format string
    ),
});
export type ParseBankStatementInput = z.infer<typeof ParseBankStatementInputSchema>;

const ParseBankStatementOutputSchema = z.object({
  transactions: z.array(
    z.object({
      date: z.string().describe('The date of the transaction.'),
      description: z.string().describe('The description of the transaction.'),
      amount: z.number().describe('The amount of the transaction.'),
    })
  ).describe('An array of transactions extracted from the bank statement.'),
});
export type ParseBankStatementOutput = z.infer<typeof ParseBankStatementOutputSchema>;

export async function parseBankStatement(input: ParseBankStatementInput): Promise<ParseBankStatementOutput> {
  return parseBankStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseBankStatementPrompt',
  input: {schema: ParseBankStatementInputSchema},
  output: {schema: ParseBankStatementOutputSchema},
  prompt: `You are an expert financial data extractor.  You will extract transactions from a bank statement.

  The bank statement is provided as a data URI. Extract all transactions from the statement, including the date, description, and amount.

  Bank Statement: {{media url=statementDataUri}}

  Ensure that the output is a JSON array of transactions, where each transaction has the fields \"date\", \"description\", and \"amount\".  The amount should be a number, not a string.`, // Added instructions for JSON format
});

const parseBankStatementFlow = ai.defineFlow(
  {
    name: 'parseBankStatementFlow',
    inputSchema: ParseBankStatementInputSchema,
    outputSchema: ParseBankStatementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
