import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "image-gallery-dev.firebaseapp.com",
  projectId: "image-gallery-dev",
  storageBucket: "image-gallery-dev.appspot.com",
  messagingSenderId: "170427468908",
  appId: "1:170427468908:web:b2d9ab15c2b68c5cccc2cc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);