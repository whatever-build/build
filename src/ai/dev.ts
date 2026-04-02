import { config } from 'dotenv';
config();

import '@/ai/flows/filter-mnemonics-heuristically.ts';
import '@/ai/flows/generate-secure-mnemonics.ts';
import '@/ai/flows/interrogate-mnemonic.ts';
import '@/ai/flows/notify-payout-saved.ts';
