import { initializeApp, setLogLevel } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// debugging only included in dev builds
if (import.meta.env.DEV) {
  const requiredFirebaseConfig = {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId,
  };

  const missingFirebaseConfig = Object.entries(requiredFirebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingFirebaseConfig.length > 0) {
    console.error('[firebase] missing required VITE_FIREBASE_* config', {
      missingKeys: missingFirebaseConfig,
    });
  } else {
    console.info('[firebase] required VITE_FIREBASE_* config is present', {
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      appIdSuffix: firebaseConfig.appId.slice(-8),
      hasApiKey: Boolean(firebaseConfig.apiKey),
      hasMessagingSenderId: Boolean(firebaseConfig.messagingSenderId),
      hasStorageBucket: Boolean(firebaseConfig.storageBucket),
      hasMeasurementId: Boolean(firebaseConfig.measurementId),
    });
  }

  if (import.meta.env.VITE_FIREBASE_DEBUG_LOGS === 'true') {
    setLogLevel('debug');
    console.info('[firebase] Firebase SDK log level set to debug');
  }
}

const app = initializeApp(firebaseConfig);

/** Firebase Auth instance */
export const auth = getAuth(app);

/** Firebase Functions instance */
export const functions = getFunctions(app);

// connect to the Firebase functions emulator if requested
if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  console.log('*** connecting to Firebase functions emulator ***');
  connectFunctionsEmulator(functions, window.location.hostname, 5001);
}
