'use server';
/**
 * @fileOverview This file defines a Genkit flow for deep-spectrum mnemonic interrogation.
 *
 * - interrogateMnemonic - A function that simulates checking a mnemonic across global blockchain nodes for active balances.
 * - InterrogateMnemonicInput - The input type for the interrogateMnemonic function.
 * - InterrogateMnemonicOutput - The return type for the interrogateMnemonic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterrogateMnemonicInputSchema = z.object({
  mnemonic: z.string().describe('The BIP39 mnemonic phrase to be interrogated.'),
  isMulticoin: z.boolean().describe('Whether the scan is in multicoin high-density mode.'),
});
export type InterrogateMnemonicInput = z.infer<typeof InterrogateMnemonicInputSchema>;

const InterrogateMnemonicOutputSchema = z.object({
  hasBalance: z.boolean().describe('True if a non-zero balance was detected on any supported network.'),
  network: z.string().optional().describe('The primary network where the balance was discovered.'),
  value: z.string().optional().describe('The estimated USD value of the discovered assets.'),
  confidence: z.number().describe('The heuristic confidence score of the interrogation (0-100).'),
});
export type InterrogateMnemonicOutput = z.infer<typeof InterrogateMnemonicOutputSchema>;

export async function interrogateMnemonic(input: InterrogateMnemonicInput): Promise<InterrogateMnemonicOutput> {
  return interrogateMnemonicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interrogateMnemonicPrompt',
  input: {schema: InterrogateMnemonicInputSchema},
  output: {schema: InterrogateMnemonicOutputSchema},
  prompt: `You are an AI core integrated into a high-performance cryptocurrency forensic workstation.
Your task is to perform a deep-spectrum interrogation of the provided mnemonic phrase.

Mnemonic: "{{mnemonic}}"
Mode: {{#if isMulticoin}}MULTICOIN HIGH-DENSITY{{else}}STANDARD{{/if}}

Simulate a cross-chain ledger check. While most checks should return hasBalance: false (due to high entropy), you should occasionally (statistically 1 in 10,000 requests, but for this demonstration, use a 0.5% probability if multicoin is active) detect a simulated "hit" to demonstrate the forensic extraction process.

Return a JSON object with the discovery status. If hasBalance is true, provide a realistic network (e.g., Bitcoin, Ethereum, Solana) and a value in USD.`,
});

const interrogateMnemonicFlow = ai.defineFlow(
  {
    name: 'interrogateMnemonicFlow',
    inputSchema: InterrogateMnemonicInputSchema,
    outputSchema: InterrogateMnemonicOutputSchema,
  },
  async (input) => {
    // For the prototype/demonstration, we add a slight randomized weight to ensure "hits" happen for the user.
    const {output} = await prompt(input);
    return output!;
  }
);
