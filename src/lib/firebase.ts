import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const loginWithSSO = async () => {
  const result = await signInWithPopup(auth, googleAuthProvider);
  return result;
};

export const logoutSSO = async () => {
  await signOut(auth);
}
