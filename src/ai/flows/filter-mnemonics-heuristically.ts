'use server';
/**
 * @fileOverview This file defines a Genkit flow for heuristically filtering and prioritizing potential BIP39 mnemonics.
 *
 * - filterMnemonicsHeuristically - A function that takes a list of mnemonics and prioritizes them based on probabilistic checksum patterns.
 * - FilterMnemonicsHeuristicallyInput - The input type for the filterMnemonicsHeuristically function.
 * - FilterMnemonicsHeuristicallyOutput - The return type for the filterMnemonicsHeuristically function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterMnemonicsHeuristicallyInputSchema = z.object({
  mnemonics: z.array(z.string()).describe('An array of potential BIP39 mnemonic phrases to be filtered and prioritized.'),
  context: z.string().optional().describe('Optional additional context or known checksum patterns to aid in prioritization.'),
});
export type FilterMnemonicsHeuristicallyInput = z.infer<typeof FilterMnemonicsHeuristicallyInputSchema>;

const PrioritizedMnemonicSchema = z.object({
  mnemonic: z.string().describe('The potential BIP39 mnemonic phrase.'),
  score: z.number().describe('A numerical score (0-100) indicating the probabilistic likelihood of this mnemonic being valid and recoverable, where 100 is most likely.'),
  reason: z.string().describe('A brief explanation for the given score and prioritization.'),
});

const FilterMnemonicsHeuristicallyOutputSchema = z.object({
  prioritizedMnemonics: z.array(PrioritizedMnemonicSchema).describe('A list of mnemonics, ordered from most likely to least likely to be valid, along with their scores and reasons.'),
});
export type FilterMnemonicsHeuristicallyOutput = z.infer<typeof FilterMnemonicsHeuristicallyOutputSchema>;

export async function filterMnemonicsHeuristically(input: FilterMnemonicsHeuristicallyInput): Promise<FilterMnemonicsHeuristicallyOutput> {
  return filterMnemonicsHeuristicallyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterMnemonicsHeuristicallyPrompt',
  input: {schema: FilterMnemonicsHeuristicallyInputSchema},
  output: {schema: FilterMnemonicsHeuristicallyOutputSchema},
  prompt: `You are an expert in cryptocurrency wallet recovery and BIP39 mnemonic phrase validation.\n\nYour task is to analyze a list of potential mnemonic phrases and prioritize them based on their probabilistic likelihood of being valid, focusing on common checksum patterns, word list validity, and other heuristic indicators.\n\nConsider the following potential mnemonic phrases:\n\n{{#each mnemonics}}\n- \"{{this}}\"\n{{/each}}\n\n{{#if context}}\nAdditional context or known checksum patterns to consider: {{{context}}}\n{{/if}}\n\nFor each mnemonic, provide a score from 0 to 100, where 100 indicates the highest likelihood of validity, and a concise reason for its prioritization. Return the mnemonics in descending order of their score.`,
});

const filterMnemonicsHeuristicallyFlow = ai.defineFlow(
  {
    name: 'filterMnemonicsHeuristicallyFlow',
    inputSchema: FilterMnemonicsHeuristicallyInputSchema,
    outputSchema: FilterMnemonicsHeuristicallyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
