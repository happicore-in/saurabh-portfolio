import { 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User,
  IdTokenResult
} from 'firebase/auth';
import { auth } from '../firebase';

// Designated Admin Emails that are recognized for administrative dashboard access
// In addition to Firebase Auth Custom Claims (admin: true)
export const AUTHORIZED_ADMIN_EMAILS = [
  'saurabhcore31@gmail.com',
  'saurabh22102@gmail.com'
];

export interface AdminAuthStatus {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  hasCustomClaim: boolean;
  claims: Record<string, unknown>;
  email: string | null;
}

/**
 * Parses Firebase Auth error codes to user-friendly messages
 */
export function getFirebaseAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/user-not-found':
      return 'No registered account found with this email address.';
    case 'auth/invalid-email':
      return 'Please provide a valid email format (e.g. name@example.com).';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed login attempts. Please reset password or retry shortly.';
    case 'auth/network-request-failed':
      return 'Network communication failed. Please check your internet connection and try again.';
    case 'auth/user-disabled':
      return 'This administrator account has been suspended or disabled.';
    case 'auth/requires-recent-login':
      return 'This action requires recent authentication. Please sign in again.';
    default:
      return error?.message || 'Authentication failed. Please verify your credentials.';
  }
}

/**
 * Sign in with Email and Password using Firebase Auth
 */
export async function signInAdminWithEmail(
  email: string, 
  pass: string, 
  rememberMe: boolean = true
): Promise<User> {
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  } catch (err) {
    console.warn('[Firebase Auth] Could not set persistence:', err);
  }
  
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return credential.user;
}

/**
 * Sends real Firebase Password Reset Email
 */
export async function sendAdminPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign out of Firebase Auth
 */
export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Verifies if the authenticated user has Admin authorization.
 * Checks for custom claim `admin === true`, and matches authorized admin emails.
 */
export async function verifyAdminStatus(user: User | null, forceRefresh: boolean = false): Promise<AdminAuthStatus> {
  if (!user) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      hasCustomClaim: false,
      claims: {},
      email: null
    };
  }

  try {
    const tokenResult: IdTokenResult = await user.getIdTokenResult(forceRefresh);
    const hasCustomClaim = Boolean(tokenResult.claims.admin);
    const userEmail = (user.email || '').toLowerCase().trim();
    const isAuthorizedEmail = AUTHORIZED_ADMIN_EMAILS.some(
      e => e.toLowerCase() === userEmail
    );

    // An authorized admin is someone with the Firebase custom claim `admin: true`
    // OR verified authorized admin email address
    const isAdmin = hasCustomClaim || isAuthorizedEmail;

    return {
      isAuthenticated: true,
      isAdmin,
      user,
      hasCustomClaim,
      claims: tokenResult.claims as Record<string, unknown>,
      email: user.email
    };
  } catch (err) {
    console.error('[Firebase Auth] Error inspecting user admin claims:', err);
    return {
      isAuthenticated: true,
      isAdmin: false,
      user,
      hasCustomClaim: false,
      claims: {},
      email: user.email
    };
  }
}

/**
 * Subscribes to Firebase Auth state changes
 */
export function subscribeToAuth(callback: (status: AdminAuthStatus) => void): () => void {
  return onAuthStateChanged(auth, async (user) => {
    const status = await verifyAdminStatus(user);
    callback(status);
  });
}
