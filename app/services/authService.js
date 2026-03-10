import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  setAuthToken,
  removeAuthToken,
  setUser,
  removeUser,
  getUser,
} from '../utils/storage';

WebBrowser.maybeCompleteAuthSession();

// ── Configuration ────────────────────────────────────────────────

// In production, read these from environment / app config.
// For development with AUTH0_MOCK=true, the AuthContext bypasses this entirely.
const AUTH0_DOMAIN = 'your-tenant.auth0.com';
const AUTH0_CLIENT_ID = 'your-client-id';

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'workflo' });

const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/v2/logout`,
};

// ── Login ────────────────────────────────────────────────────────

export const buildAuthRequest = () => {
  return new AuthSession.AuthRequest({
    clientId: AUTH0_CLIENT_ID,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Token,
    extraParams: { audience: `https://${AUTH0_DOMAIN}/api/v2/` },
  });
};

export const getDiscovery = () => discovery;
export const getRedirectUri = () => redirectUri;

/**
 * Decode a JWT token to get the user payload (header.payload.signature).
 */
export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

/**
 * Handle auth response from Auth0 – persist token & user.
 */
export const handleAuthResponse = async (response) => {
  if (response?.type === 'success' && response.params?.access_token) {
    const token = response.params.access_token;
    await setAuthToken(token);
    const decoded = decodeToken(response.params.id_token || token);
    const user = {
      name: decoded?.name || decoded?.nickname || 'User',
      email: decoded?.email || '',
    };
    await setUser(user);
    return { token, user };
  }
  return null;
};

// ── Logout ───────────────────────────────────────────────────────

export const logout = async () => {
  await removeAuthToken();
  await removeUser();
};

// ── Stored user ──────────────────────────────────────────────────

export const getStoredUser = async () => getUser();
