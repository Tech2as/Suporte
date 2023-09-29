import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCeLPnyBpRugBjJHzm_o4Y688JmS_YBub8",
    authDomain: "chamado-b8b05.firebaseapp.com",
    projectId: "chamado-b8b05",
    storageBucket: "chamado-b8b05.appspot.com",
    messagingSenderId: "1031800713699",
    appId: "1:1031800713699:web:bd910d8a56d6ac989d70d6",
    measurementId: "G-816X4NEG8W"
  };

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth,db,storage }