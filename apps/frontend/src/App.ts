import m from 'mithril';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import type { Unsubscribe, User } from 'firebase/auth';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/button/button.js';
import type WaInput from '@awesome.me/webawesome/dist/components/input/input.js';

import BatteryDashboard from './components/BatteryDashboard.js';
import GoogleSignInButton from './components/GoogleSignInButton.js';
import SummaryCard from './components/SummaryCard.js';
import PresenceDashboard from './components/PresenceDashboard.js';
import WeatherDashboard from './components/WeatherDashboard.js';
import { auth } from './firebase.js';

const provider = new GoogleAuthProvider();

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
    email: '',
    password: '',
    emailError: null as string | null,
  };

  const startEmailSignIn = async () => {
    if (state.signingIn) {
      return;
    }
    state.signingIn = true;
    state.emailError = null;
    m.redraw();

    try {
      await signInWithEmailAndPassword(auth, state.email, state.password);
      state.signingIn = false;
      m.redraw();
    } catch (error) {
      state.signingIn = false;
      state.emailError = 'Sign-in failed. Check your email and password.';
      logAuthError('Email/password sign-in failed', error);
      m.redraw();
    }
  };

  const startGoogleSignIn = async () => {
    if (state.signingIn) {
      return;
    }

    if (import.meta.env.DEV) {
      console.info('[auth] starting Google sign-in', {
        mode: 'popup',
        hostname: window.location.hostname,
      });
    }
    state.signingIn = true;
    m.redraw();

    try {
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
    } catch (error) {
      state.signingIn = false;
      logAuthError('Google sign-in (popup) failed', error);
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
          m('form.email-sign-in', {
            onsubmit: (e: Event) => {
              e.preventDefault();
              void startEmailSignIn();
            },
          }, [
            m('wa-input', {
              type: 'email',
              label: 'Email',
              required: true,
              value: state.email,
              oninput: (e: Event) => {
                state.email = (e.target as WaInput).value ?? '';
              },
            }),
            m('wa-input', {
              type: 'password',
              label: 'Password',
              required: true,
              value: state.password,
              oninput: (e: Event) => {
                state.password = (e.target as WaInput).value ?? '';
              },
            }),
            state.emailError ? m('p.email-error', state.emailError) : null,
            m('wa-button', {
              type: 'submit',
              variant: 'brand',
              size: 'large',
              loading: state.signingIn,
            }, 'Sign in with Email'),
          ]),
        ]);
      }

      return m('main', [
        m('h1', 'Camp 42 Dashboard'),
        m(SummaryCard),
        m(PresenceDashboard),
        m(BatteryDashboard),
        m(WeatherDashboard),
      ]);
    },
  };
};

export default App;
