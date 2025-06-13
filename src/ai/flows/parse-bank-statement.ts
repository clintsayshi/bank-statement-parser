
'use server';

/**
 * @fileOverview A flow that extracts transaction details and metadata from a bank statement.
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
      'A bank statement, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type ParseBankStatementInput = z.infer<typeof ParseBankStatementInputSchema>;

const TransactionSchema = z.object({
  date: z.string().describe('The date of the transaction.'),
  description: z.string().describe('The description of the transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
});

const ParseBankStatementOutputSchema = z.object({
  accountHolderName: z.string().optional().describe('The name of the account holder.'),
  accountNumber: z.string().optional().describe('The bank account number (last few digits if partially redacted).'),
  bankName: z.string().optional().describe('The name of the bank.'),
  statementPeriod: z.string().optional().describe('The period covered by the statement (e.g., "Jan 1, 2023 - Jan 31, 2023").'),
  bankAddress: z.string().optional().describe('The address of the bank.'),
  transactions: z.array(TransactionSchema).describe('An array of transactions extracted from the bank statement.'),
});
export type ParseBankStatementOutput = z.infer<typeof ParseBankStatementOutputSchema>;

export async function parseBankStatement(input: ParseBankStatementInput): Promise<ParseBankStatementOutput> {
  return parseBankStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseBankStatementPrompt',
  input: {schema: ParseBankStatementInputSchema},
  output: {schema: ParseBankStatementOutputSchema},
  prompt: `You are an expert financial data extractor. You will extract transactions and key metadata from a bank statement.

The bank statement is provided as a data URI. Extract all transactions from the statement, including the date, description, and amount.
Also, extract the following metadata if available:
- Account Holder Name (accountHolderName)
- Account Number (accountNumber) - if partially redacted, extract the visible part.
- Bank Name (bankName)
- Statement Period (statementPeriod) (e.g., "Jan 1, 2023 - Jan 31, 2023")
- Bank Address (bankAddress)

Bank Statement: {{media url=statementDataUri}}

Ensure that the output is a JSON object.
This object MUST contain a 'transactions' field which is an array of transactions (each with "date", "description", "amount" - amount as a number).
The object should also contain the optional top-level fields: 'accountHolderName', 'accountNumber', 'bankName', 'statementPeriod', and 'bankAddress' if this information is found in the statement. If a field is not found, omit it from the JSON output.
The date should be formatted as YYYY-MM-DD if possible, otherwise, use the format present in the statement.
Amounts should be numbers. For expenses, use negative numbers. For income/credits, use positive numbers.
If the statement is unclear or data is missing for certain transactions, do your best to extract what is available.
`,
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

