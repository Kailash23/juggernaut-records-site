import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBsZ9dS99hmXHdWlVuHvjnpDk7WrF6EU2Y',
  authDomain: 'juggernaut-records.firebaseapp.com',
  projectId: 'juggernaut-records',
  storageBucket: 'juggernaut-records.appspot.com',
  messagingSenderId: '248828010738',
  appId: '1:248828010738:web:c734e9f6d6f10e6756b06b',
  measurementId: 'G-W9CQ3VBRZF',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
