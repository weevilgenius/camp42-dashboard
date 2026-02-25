import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const app = initializeApp({ projectId: 'camp42-dashboard' });

/** Firebase Functions instance */
export const functions = getFunctions(app);

// connect to the Firebase functions emulator if requested
if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  console.log('*** connecting to Firebase functions emulator ***');
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}
