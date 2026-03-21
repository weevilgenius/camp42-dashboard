import m from 'mithril';
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import type { Unsubscribe, User } from 'firebase/auth';

import BatteryDashboard from './components/BatteryDashboard.js';
import GoogleSignInButton from './components/GoogleSignInButton.js';
import WeatherDashboard from './components/WeatherDashboard.js';
import { auth } from './firebase.js';

const provider = new GoogleAuthProvider();

const isLocalDevHost = (): boolean => {
  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1';
};

const logAuthError = (context: string, error: unknown) => {
  const details = error as { code?: string; message?: string; customData?: unknown };
  console.error(`[auth] ${context}`, {
    code: details.code,
    message: details.message,
    customData: details.customData,
  });
};

/** Root app component that gates dashboard rendering on Google authentication. */
export const App: m.ClosureComponent = () => {
  const state = {
    authResolved: false,
    user: null as User | null,
    signingIn: false,
    unsubscribe: null as Unsubscribe | null,
  };

  const startGoogleSignIn = async () => {
    if (state.signingIn) {
      return;
    }

    const usePopup = isLocalDevHost();
    const mode = usePopup ? 'popup' : 'redirect';
    if (import.meta.env.DEV) {
      console.info('[auth] starting Google sign-in', {
        mode,
        hostname: window.location.hostname,
      });
    }
    state.signingIn = true;
    m.redraw();

    try {
      if (usePopup) {
        const result = await signInWithPopup(auth, provider);
        if (import.meta.env.DEV) {
          console.info('[auth] popup sign-in result received', {
            uid: result.user.uid,
            email: result.user.email,
            providerIds: result.user.providerData.map((providerInfo) => providerInfo.providerId),
          });
        }
        state.signingIn = false;
        m.redraw();
      } else {
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      state.signingIn = false;
      logAuthError(`Google sign-in (${mode}) failed`, error);
      m.redraw();
    }
  };

  return {
    oninit: () => {
      if (import.meta.env.DEV) {
        console.info('[auth] app init', {
          origin: window.location.origin,
          path: window.location.pathname,
        });
      }

      void getRedirectResult(auth)
        .then((result) => {
          if (!result) {
            console.info('[auth] redirect result: none');
            return;
          }

          if (import.meta.env.DEV) {
            console.info('[auth] redirect result received', {
              uid: result.user.uid,
              email: result.user.email,
              providerIds: result.user.providerData.map((providerInfo) => providerInfo.providerId),
            });
          }
        })
        .catch((error: unknown) => {
          logAuthError('getRedirectResult failed', error);
        });

      state.unsubscribe = onAuthStateChanged(auth, (user) => {
        if (import.meta.env.DEV) {
          console.info('[auth] onAuthStateChanged fired', {
            hasUser: Boolean(user),
            uid: user?.uid,
            email: user?.email,
            providerIds: user?.providerData?.map((providerInfo) => providerInfo.providerId) ?? [],
          });
        }

        state.user = user;
        state.authResolved = true;

        if (user) {
          state.signingIn = false;
        }

        m.redraw();
      });
    },

    onremove: () => {
      state.unsubscribe?.();
    },

    view: () => {
      if (!state.authResolved) {
        return null;
      }

      if (!state.user) {
        return m('main', [
          m(GoogleSignInButton, {
            loading: state.signingIn,
            label: 'Sign in with Google',
            onClicked: () => {
              void startGoogleSignIn();
            },
          }),
        ]);
      }

      return m('main', [
        m('h1', 'Camp 42 Dashboard'),
        m(BatteryDashboard),
        m(WeatherDashboard),
      ]);
    },
  };
};

export default App;
