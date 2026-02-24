import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const app = initializeApp({ projectId: 'camp42-dashboard' });

/** Firebase Functions instance */
export const functions = getFunctions(app);

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  console.log('*** connecting to Firebase functions emulator ***');
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}
