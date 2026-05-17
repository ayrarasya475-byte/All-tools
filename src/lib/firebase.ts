import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, query, orderBy, limit, onSnapshot, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Critical connection test
const testConnection = async () => {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
};

testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Global user profile sync
export const syncUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    
    const ownerEmail = 'ayrarasya475@gmail.com';
    const role = user.email === ownerEmail ? 'owner' : (snap.exists() ? (snap.data().role || 'user') : 'user');

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastSeen: Date.now(),
      updatedAt: serverTimestamp(),
      role: role,
    };

    if (!snap.exists()) {
      // New user
      await setDoc(userRef, {
        ...data,
        status: 'active',
        createdAt: serverTimestamp(),
        ip: 'unknown',
        userAgent: navigator.userAgent
      });
    } else {
      // Existing user
      await updateDoc(userRef, data);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
};

export const toggleFavorite = async (userId: string, toolId: string) => {
  const favRef = doc(db, `users/${userId}/favorites`, toolId);
  try {
    const snap = await getDoc(favRef);
    
    if (snap.exists()) {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        toolId,
        addedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/favorites/${toolId}`);
  }
};
