import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from 'firebase/auth';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

const authMocks = vi.hoisted(() => {
  return {
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
  };
});

vi.mock('../src/firebase.js', () => ({
  auth: {},
}));

vi.mock('@awesome.me/webawesome/dist/components/button/button.js', () => ({}));

vi.mock('firebase/auth', () => {
  return {
    GoogleAuthProvider: class GoogleAuthProvider {},
    onAuthStateChanged: authMocks.onAuthStateChanged,
    signInWithPopup: authMocks.signInWithPopup,
  };
});

vi.mock('../src/components/BatteryDashboard.js', () => ({
  default: {
    view: () => 'battery dashboard',
  },
}));

vi.mock('../src/components/WeatherDashboard.js', () => ({
  default: {
    view: () => 'weather dashboard',
  },
}));

import { App } from '../src/App.js';

describe('App auth gate', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let view: MountedComponent<any>;
  let authStateChangedCallback: ((user: User | null) => void) | null;
  let unsubscribe: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    authStateChangedCallback = null;
    unsubscribe = vi.fn();

    authMocks.onAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: User | null) => void) => {
        authStateChangedCallback = callback;
        return unsubscribe;
      },
    );
    authMocks.signInWithPopup.mockResolvedValue({
      user: {
        uid: 'popup-user',
        email: 'popup@example.com',
        providerData: [],
      },
    });
  });

  afterEach(() => {
    view?.unmount();
    vi.clearAllMocks();
  });

  it('renders no UI while auth state is unresolved', () => {
    view = renderComponent(App);

    expect(view.root.textContent?.trim()).toBe('');
    expect(authMocks.signInWithPopup).not.toHaveBeenCalled();
  });

  it('renders the dashboard when authenticated', () => {
    view = renderComponent(App);

    const user = { uid: 'user-1' } as User;
    authStateChangedCallback?.(user);
    view.redraw();

    expect(view.root.querySelector('h1')?.textContent).toBe('Camp 42 Dashboard');
    expect(view.root.textContent).toContain('battery dashboard');
    expect(view.root.textContent).toContain('weather dashboard');
  });

  it('renders a sign-in button and does not auto-redirect when unauthenticated', () => {
    view = renderComponent(App);

    authStateChangedCallback?.(null);
    view.redraw();

    const signInButton = view.root.querySelector('wa-button');
    expect(signInButton).not.toBeNull();
    expect(signInButton?.textContent).toContain('Sign in with Google');
    expect(view.root.querySelector('h1')).toBeNull();
    expect(authMocks.signInWithPopup).not.toHaveBeenCalled();
  });

  it('triggers Google popup sign-in after clicking the sign-in button', () => {
    view = renderComponent(App);

    authStateChangedCallback?.(null);
    view.redraw();

    const signInButton = view.root.querySelector('wa-button');
    signInButton?.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

    expect(authMocks.signInWithPopup).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes auth listener on unmount', () => {
    view = renderComponent(App);
    view.unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
