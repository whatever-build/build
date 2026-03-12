'use server';
/**
 * @fileOverview This file implements a Genkit flow for demonstrating the generation of BIP39-like mnemonic phrases using AI.
 *
 * - generateSecureMnemonics - A function that generates a BIP39-like mnemonic phrase based on user-defined parameters.
 * - GenerateSecureMnemonicsInput - The input type for the generateSecureMnemonics function.
 * - GenerateSecureMnemonicsOutput - The return type for the generateSecureMnemonics function.
 *
 * IMPORTANT SECURITY NOTE: The AI-generated mnemonics are NOT cryptographically secure and should NEVER be used for real cryptocurrency wallets or assets.
 * They are intended solely for illustrative and demonstrative purposes to show the structure of such phrases.
 * Real BIP39 mnemonics require true random number generation from cryptographically secure sources.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateSecureMnemonicsInputSchema = z.object({
  wordCount: z.union([z.literal(12), z.literal(18), z.literal(24)]).describe('The desired number of words for the BIP39-like mnemonic phrase (12, 18, or 24).'),
  theme: z.string().optional().describe('An optional theme or context to influence the words generated (e.g., "nature-themed", "space-themed").'),
});
export type GenerateSecureMnemonicsInput = z.infer<typeof GenerateSecureMnemonicsInputSchema>;

// Output Schema
const GenerateSecureMnemonicsOutputSchema = z.object({
  mnemonicPhrase: z.string().describe('An AI-generated sequence of words resembling a BIP39 mnemonic phrase. IMPORTANT: This is for illustrative purposes only and is NOT cryptographically secure. DO NOT use for real assets.'),
  securityWarning: z.string().describe('Critical security warning: AI-generated mnemonics are not cryptographically secure and must never be used for real cryptocurrency wallets or assets. True security requires cryptographically secure random number generation.'),
});
export type GenerateSecureMnemonicsOutput = z.infer<typeof GenerateSecureMnemonicsOutputSchema>;

// Wrapper function
export async function generateSecureMnemonics(input: GenerateSecureMnemonicsInput): Promise<GenerateSecureMnemonicsOutput> {
  return generateSecureMnemonicsFlow(input);
}

// Define the prompt
const secureMnemonicsPrompt = ai.definePrompt({
  name: 'generateSecureMnemonicsPrompt',
  input: {schema: GenerateSecureMnemonicsInputSchema},
  output: {schema: GenerateSecureMnemonicsOutputSchema},
  prompt: `You are an AI assistant designed to demonstrate the structure and appearance of BIP39-like mnemonic phrases.
Your task is to generate a sequence of words that resembles a BIP39 mnemonic based on the user's request.

**CRITICAL SECURITY WARNING**: The output generated here is purely for illustrative and demonstrative purposes. It is NOT cryptographically secure and MUST NEVER be used for real cryptocurrency wallets, digital assets, or any situation requiring cryptographic security. Real BIP39 mnemonics are generated using cryptographically secure random number generators (CSPRNGs) and not AI models. Using AI-generated mnemonics for actual assets will lead to a high risk of loss.

Generate a list of {{wordCount}} common English words, separated by spaces, to form a mnemonic phrase.
{{#if theme}}
Additionally, try to incorporate words related to a "{{theme}}" theme if possible, while still ensuring they are common words suitable for a mnemonic.
{{/if}}

Please provide the output in a JSON format matching the following structure:

Example Output (for a 12-word, nature-themed mnemonic):
{
  "mnemonicPhrase": "tree river flower mountain forest branch leaf stone wood path sky water",
  "securityWarning": "Critical security warning: AI-generated mnemonics are not cryptographically secure and must never be used for real cryptocurrency wallets or assets. True security requires cryptographically secure random number generation."
}

Generate the JSON output now:
`,
});

// Define the Genkit flow
const generateSecureMnemonicsFlow = ai.defineFlow(
  {
    name: 'generateSecureMnemonicsFlow',
    inputSchema: GenerateSecureMnemonicsInputSchema,
    outputSchema: GenerateSecureMnemonicsOutputSchema,
  },
  async (input) => {
    const {output} = await secureMnemonicsPrompt(input);

    // Always ensure the critical security warning is present and accurate, overriding any LLM attempt to alter it.
    const finalOutput: GenerateSecureMnemonicsOutput = {
        mnemonicPhrase: output!.mnemonicPhrase,
        securityWarning: "Critical security warning: AI-generated mnemonics are not cryptographically secure and must never be used for real cryptocurrency wallets or assets. True security requires cryptographically secure random number generation."
    };

    return finalOutput;
  }
);
