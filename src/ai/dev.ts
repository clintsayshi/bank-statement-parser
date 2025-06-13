import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-transactions.ts';
import '@/ai/flows/summarize-transactions.ts';
import '@/ai/flows/parse-bank-statement.ts';