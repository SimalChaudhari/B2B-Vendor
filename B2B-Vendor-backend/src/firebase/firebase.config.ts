

// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3SMLJfVQ8zxbgyzhQOSwTOXpgLIcTm-4",
  authDomain: "b2b-vendor-76300.firebaseapp.com",
  projectId: "b2b-vendor-76300",
  storageBucket: "b2b-vendor-76300.appspot.com",
  messagingSenderId: "507231915036",
  appId: "1:507231915036:web:e5c4f006b8d052130f23d9",
  measurementId: "G-YJRMHLFDHW"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };
