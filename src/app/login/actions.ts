
'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export async function authenticateUser(formData: { username: string; licenseKey: string }) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    
    // 1. Direct Document Lookup (O(1) complexity as per architecture doc)
    const userDocRef = doc(db, 'licenses', formData.username);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'Authentication Failed: Identity not recognized in neural mesh.' };
    }
    
    const data = userDoc.data();
    
    // 2. Key Matching (Case-insensitive)
    if (data.licenseKey?.toUpperCase() !== formData.licenseKey.toUpperCase()) {
      return { success: false, message: 'Authentication Failed: Credential mismatch.' };
    }
    
    // 3. Kill-Switch Verification
    if (data.active !== true) {
      return { success: false, message: 'Authentication Failed: This license has been remotely revoked.' };
    }
    
    // 4. Session Payload Injection
    session.username = formData.username;
    session.isLoggedIn = true;
    session.allowedChains = data.allowed_chains || [];
    await session.save();
    
    return { success: true };
  } catch (error: any) {
    console.error('Handshake Error:', error);
    return { success: false, message: 'Neural Handshake Error: System interrogation failed.' };
  }
}

export async function logout() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}
