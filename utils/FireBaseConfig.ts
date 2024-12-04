import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCIpiHGDvIMUPsy3w-ZxdZFNFidO_02VKQ",
    authDomain: "wordle-clone-31afe.firebaseapp.com",
    projectId: "wordle-clone-31afe",
    storageBucket: "wordle-clone-31afe.appspot.com",
    messagingSenderId: "398447550514",
    appId: "1:398447550514:web:57c49144e5aa41e3605c2b"
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB=getFirestore(app);

